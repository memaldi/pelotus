"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async onModuleInit() {
        await this.ensureDefaultPlatformAdmin();
    }
    get db() {
        return this.prisma;
    }
    get secret() {
        return process.env.AUTH_SECRET ?? "pelotus-modern-dev-secret";
    }
    async ensureDefaultPlatformAdmin() {
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
            this.logger.log(`Promoted existing user '${existing.username}' to platform admin (matched default admin config).`);
            return;
        }
        this.logger.log(`Default platform admin already available as '${existing.username}'.`);
    }
    hashPassword(password) {
        const salt = (0, crypto_1.randomBytes)(16).toString("hex");
        const derivedKey = (0, crypto_1.scryptSync)(password, salt, 64).toString("hex");
        return `${salt}:${derivedKey}`;
    }
    verifyPassword(password, storedHash) {
        const [salt, storedKey] = storedHash.split(":");
        if (!salt || !storedKey) {
            return false;
        }
        const derivedKey = (0, crypto_1.scryptSync)(password, salt, 64);
        const storedBuffer = Buffer.from(storedKey, "hex");
        return storedBuffer.length === derivedKey.length && (0, crypto_1.timingSafeEqual)(storedBuffer, derivedKey);
    }
    signToken(payload) {
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
        const signature = (0, crypto_1.createHmac)("sha256", this.secret).update(encodedPayload).digest("base64url");
        return `${encodedPayload}.${signature}`;
    }
    verifyToken(token) {
        const [encodedPayload, signature] = token.split(".");
        if (!encodedPayload || !signature) {
            throw new common_1.UnauthorizedException("Invalid token format");
        }
        const expected = (0, crypto_1.createHmac)("sha256", this.secret).update(encodedPayload).digest("base64url");
        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expected);
        if (signatureBuffer.length !== expectedBuffer.length ||
            !(0, crypto_1.timingSafeEqual)(signatureBuffer, expectedBuffer)) {
            throw new common_1.UnauthorizedException("Invalid token signature");
        }
        const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            throw new common_1.UnauthorizedException("Token expired");
        }
        return payload;
    }
    getSessionFromAuthorizationHeader(authorization) {
        if (!authorization?.startsWith("Bearer ")) {
            return null;
        }
        const token = authorization.slice("Bearer ".length);
        return this.verifyToken(token);
    }
    requireSessionFromAuthorizationHeader(authorization) {
        const session = this.getSessionFromAuthorizationHeader(authorization);
        if (!session) {
            throw new common_1.UnauthorizedException("Missing or invalid authorization header");
        }
        return session;
    }
    async requirePlatformAdminFromAuthorizationHeader(authorization) {
        const session = this.requireSessionFromAuthorizationHeader(authorization);
        const user = await this.db.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, isPlatformAdmin: true },
        });
        if (!user?.isPlatformAdmin) {
            throw new common_1.UnauthorizedException("Platform admin access required");
        }
        return session;
    }
    async register(payload) {
        if (payload.password !== payload.passwordConfirmation) {
            throw new common_1.BadRequestException("Passwords do not match");
        }
        const existingUser = await this.db.user.findFirst({
            where: {
                OR: [{ username: payload.username }, { email: payload.email }],
            },
        });
        if (existingUser) {
            throw new common_1.BadRequestException("Username or email already exists");
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
    async login(username, password) {
        const user = await this.db.user.findUnique({ where: { username } });
        if (!user || !this.verifyPassword(password, user.password)) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        return this.issueSession({
            id: user.id,
            username: user.username,
            email: user.email,
            isPlatformAdmin: user.isPlatformAdmin,
        });
    }
    issueSession(user) {
        const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
        const token = this.signToken({ user, exp });
        return { token, user, expiresAt: exp };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map