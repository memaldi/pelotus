import { OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
type SessionUser = {
    id: number;
    username: string;
    email: string;
    isPlatformAdmin: boolean;
};
export declare class AuthService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private get db();
    private get secret();
    private ensureDefaultPlatformAdmin;
    private hashPassword;
    private verifyPassword;
    private signToken;
    private verifyToken;
    getSessionFromAuthorizationHeader(authorization?: string): {
        exp: number;
        user: SessionUser;
    } | null;
    requireSessionFromAuthorizationHeader(authorization?: string): {
        exp: number;
        user: SessionUser;
    };
    requirePlatformAdminFromAuthorizationHeader(authorization?: string): Promise<{
        exp: number;
        user: SessionUser;
    }>;
    register(payload: {
        username: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }): Promise<{
        token: string;
        user: SessionUser;
        expiresAt: number;
    }>;
    login(username: string, password: string): Promise<{
        token: string;
        user: SessionUser;
        expiresAt: number;
    }>;
    private issueSession;
}
export {};
