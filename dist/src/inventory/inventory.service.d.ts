import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    purchaseProduct(productId: string, quantity: number, tenantId: string): Promise<{
        message: string;
        productId: string;
        name: string;
        oldStock: any;
        newStock: number;
    }>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: {
        name: string;
        sku: string;
        price: number;
        stock: number;
    }): Promise<any>;
}
