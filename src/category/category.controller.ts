import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentTenantId } from '../common/tenant/tenant-id.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('category')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.categoryService.create(createCategoryDto, tenantId);
  }

  @Get('categories')
  findAllWithPaginate(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const paginationDto: PaginationDto = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };
    return this.categoryService.findAllWithPaginate(paginationDto);
  }

  @Get('category/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch('category/:id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
