import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(payload: {
        username: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            email: string;
            isPlatformAdmin: boolean;
        };
        expiresAt: number;
    }>;
    login(payload: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            email: string;
            isPlatformAdmin: boolean;
        };
        expiresAt: number;
    }>;
    me(authorization?: string): {
        user: {
            id: number;
            username: string;
            email: string;
            isPlatformAdmin: boolean;
        };
    };
}
