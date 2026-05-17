import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
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
    login(data: any): Promise<{
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
    getMe(userId: string): Promise<any>;
}
