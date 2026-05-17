import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.db.invoice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.db.invoice.findUnique({
      where: { id },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async create(data: { amount: number }) {
    // Generate a random structured invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return this.prisma.db.invoice.create({
      data: {
        invoiceNumber,
        amount: data.amount,
        status: 'PENDING',
      },
    });
  }

  async markAsPaid(id: string) {
    // Check if the invoice exists (scoped automatically!)
    await this.findOne(id);

    return this.prisma.db.invoice.update({
      where: { id },
      data: { status: 'PAID' },
    });
  }
}
