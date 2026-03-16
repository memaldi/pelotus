import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { PrismaService } from "../prisma/prisma.service";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionUser = {
  id: number;
  username: string;
  email: string;
  isPlatformAdmin: boolean;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureDefaultPlatformAdmin();
  }

  private get db() {
    return this.prisma as any;
  }

  private get secret() {
    return process.env.AUTH_SECRET ?? "pelotus-modern-dev-secret";
  }

  private async ensureDefaultPlatformAdmin() {
    const username = process.env.DEFAULT_ADMIN_USERNAME?.trim();
    const email = process.env.DEFAULT_ADMIN_EMAIL?.trim();
    const password = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

    if (!username || !email || !password) {
      return;
    }

    const existing = await this.db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        isPlatformAdmin: true,
      },
    });

    if (!existing) {
      await this.db.user.create({
        data: {
          username,
          email,
          password: this.hashPassword(password),
          isPlatformAdmin: true,
        },
      });

      this.logger.log(`Created default platform admin '${username}'.`);
      return;
    }

    if (!existing.isPlatformAdmin) {
      await this.db.user.update({
        where: { id: existing.id },
        data: { isPlatformAdmin: true },
      });
      this.logger.log(
        `Promoted existing user '${existing.username}' to platform admin (matched default admin config).`,
      );
      return;
    }

    this.logger.log(`Default platform admin already available as '${existing.username}'.`);
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${derivedKey}`;
  }

  private verifyPassword(password: string, storedHash: string) {
    const [salt, storedKey] = storedHash.split(":");
    if (!salt || !storedKey) {
      return false;
    }

    const derivedKey = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedKey, "hex");
    return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey);
  }

  private signToken(payload: Record<string, unknown>) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", this.secret).update(encodedPayload).digest("base64url");
    return `${encodedPayload}.${signature}`;
  }

  private verifyToken(token: string) {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
      throw new UnauthorizedException("Invalid token format");
    }

    const expected = createHmac("sha256", this.secret).update(encodedPayload).digest("base64url");
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException("Invalid token signature");
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      exp: number;
      user: SessionUser;
    };

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException("Token expired");
    }

    return payload;
  }

  getSessionFromAuthorizationHeader(authorization?: string) {
    if (!authorization?.startsWith("Bearer ")) {
      return null;
    }

    const token = authorization.slice("Bearer ".length);
    return this.verifyToken(token);
  }

  requireSessionFromAuthorizationHeader(authorization?: string) {
    const session = this.getSessionFromAuthorizationHeader(authorization);
    if (!session) {
      throw new UnauthorizedException("Missing or invalid authorization header");
    }
    return session;
  }

  async requirePlatformAdminFromAuthorizationHeader(authorization?: string) {
    const session = this.requireSessionFromAuthorizationHeader(authorization);
    const user = await this.db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isPlatformAdmin: true },
    });

    if (!user?.isPlatformAdmin) {
      throw new UnauthorizedException("Platform admin access required");
    }

    return session;
  }

  async register(payload: {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) {
    if (payload.password !== payload.passwordConfirmation) {
      throw new BadRequestException("Passwords do not match");
    }

    const existingUser = await this.db.user.findFirst({
      where: {
        OR: [{ username: payload.username }, { email: payload.email }],
      },
    });

    if (existingUser) {
      throw new BadRequestException("Username or email already exists");
    }

    const usersCount = await this.db.user.count();

    const user = await this.db.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        password: this.hashPassword(payload.password),
        isPlatformAdmin: usersCount === 0,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isPlatformAdmin: true,
      },
    });

    return this.issueSession(user);
  }

  async login(username: string, password: string) {
    const user = await this.db.user.findUnique({ where: { username } });
    if (!user || !this.verifyPassword(password, user.password)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.issueSession({
      id: user.id,
      username: user.username,
      email: user.email,
      isPlatformAdmin: user.isPlatformAdmin,
    });
  }

  private issueSession(user: SessionUser) {
    const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    const token = this.signToken({ user, exp });
    return { token, user, expiresAt: exp };
  }
}
