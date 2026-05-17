import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

class CreateInvoiceDto {
  amount: number;
}

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async findAll() {
    return this.invoiceService.findAll();
  }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id/pay')
  async pay(@Param('id') id: string) {
    return this.invoiceService.markAsPaid(id);
  }
}
