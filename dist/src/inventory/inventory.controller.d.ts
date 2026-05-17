import { InventoryService } from './inventory.service';
declare class CreateProductDto {
    name: string;
    sku: string;
    price: number;
    stock: number;
}
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<any>;
    create(createProductDto: CreateProductDto): Promise<any>;
    findOne(id: string): Promise<any>;
    purchase(id: string, quantity: number, tenantId: string): Promise<{
        message: string;
        productId: string;
        name: string;
        oldStock: any;
        newStock: number;
    }>;
}
export {};
