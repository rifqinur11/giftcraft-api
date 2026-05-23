import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GeneralSuccessDto } from 'src/common/dto/general-success.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto, tenantId: string) {
    await this.prisma.raw.category.create({
      data: createCategoryDto,
    });

    return new GeneralSuccessDto("CAT01 - 201", "Category created successfully", undefined);
  }

  async findAll() {
    const data = await this.prisma.raw.category.findMany();
    return new GeneralSuccessDto(undefined, undefined, data);
  }

  async findAllWithPaginate(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, totalItems] = await Promise.all([
      this.prisma.raw.category.findMany({
        skip: skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      this.prisma.raw.category.count()
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const meta = {
      totalItems,
      totalPages,
      page,
      limit,
    };

    return new GeneralSuccessDto(undefined, undefined, data, meta);
  }

  async findOne(id: string) {
    const category = await this.prisma.raw.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.raw.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.raw.category.delete({
      where: { id },
    });
  }
}
