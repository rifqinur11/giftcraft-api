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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async purchaseProduct(productId, quantity, tenantId) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than zero.');
        }
        return this.prisma.raw.$transaction(async (tx) => {
            const products = await tx.$queryRawUnsafe(`SELECT * FROM "Product" WHERE "id" = $1 AND "tenantId" = $2 FOR UPDATE`, productId, tenantId);
            if (!products || products.length === 0) {
                throw new common_1.NotFoundException(`Product not found or access denied.`);
            }
            const product = products[0];
            if (product.stock < quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}. Requested: ${quantity}, Available: ${product.stock}`);
            }
            const newStock = product.stock - quantity;
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { stock: newStock },
            });
            return {
                message: 'Purchase successful',
                productId: updatedProduct.id,
                name: updatedProduct.name,
                oldStock: product.stock,
                newStock: updatedProduct.stock,
            };
        });
    }
    async findAll() {
        return this.prisma.db.product.findMany();
    }
    async findOne(id) {
        const product = await this.prisma.db.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async create(data) {
        return this.prisma.db.product.create({
            data,
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map