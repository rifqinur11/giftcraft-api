import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Safe stock reduction using pessimistic locking (SELECT ... FOR UPDATE).
   * This prevents concurrent operations from causing negative stock or race conditions.
   */
  async purchaseProduct(productId: string, quantity: number, tenantId: string) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero.');
    }

    // Run within a database transaction
    return this.prisma.raw.$transaction(async (tx) => {
      // 1. Lock the row using pessimistic locking 'FOR UPDATE'
      // We must query raw SQL because Prisma ORM doesn't support 'FOR UPDATE' natively yet.
      // Note: We include tenantId to ensure strict tenant isolation in the lock query itself.
      const products = await tx.$queryRawUnsafe<any[]>(
        `SELECT * FROM "Product" WHERE "id" = $1 AND "tenantId" = $2 FOR UPDATE`,
        productId,
        tenantId,
      );

      if (!products || products.length === 0) {
        throw new NotFoundException(`Product not found or access denied.`);
      }

      const product = products[0];

      // 2. Business Logic validation
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Requested: ${quantity}, Available: ${product.stock}`,
        );
      }

      // 3. Perform the update inside the same transaction
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

  // Regular non-blocking methods that use our global tenant-scoped client
  async findAll() {
    return this.prisma.db.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.db.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(data: { name: string; sku: string; price: number; stock: number }) {
    return this.prisma.db.product.create({
      data,
    });
  }
}
