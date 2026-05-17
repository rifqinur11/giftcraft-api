import { PrismaService } from '../prisma/prisma.service';
export declare class InvoiceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: {
        amount: number;
    }): Promise<any>;
    markAsPaid(id: string): Promise<any>;
}
