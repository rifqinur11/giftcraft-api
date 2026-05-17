import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CurrentTenantId } from '../common/tenant/tenant-id.decorator';

class CreateProductDto {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

class PurchaseProductDto {
  quantity: number;
}

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.inventoryService.create(createProductDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post(':id/purchase')
  async purchase(
    @Param('id') id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.inventoryService.purchaseProduct(id, quantity, tenantId);
  }
}
