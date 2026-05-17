import { AuthService } from './auth.service';
import * as express from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: any): Promise<{
        message: string;
        tenant: {
            id: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
        };
    }>;
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
        };
        tenant: {
            id: string;
            name: string;
        };
    }>;
    getMe(req: express.Request): Promise<any>;
}
