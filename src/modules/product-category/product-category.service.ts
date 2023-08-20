import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateProductCategoryData,
  CreateProductCategoryDto,
} from './dto/create-product-category.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import {
  UpdateProductCategoryData,
  UpdateProductCategoryDto,
} from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const data = CreateProductCategoryData(createProductCategoryDto);

    // 将 order 设置为最大的
    const maxOrderProductCategory = await this.prisma.productCategory.findFirst(
      {
        where: { shopId: createProductCategoryDto.shopId },
        orderBy: { order: 'desc' },
        select: { order: true },
      },
    );
    const order = maxOrderProductCategory
      ? maxOrderProductCategory.order + 1
      : 1;

    return this.prisma.productCategory.create({
      data: {
        ...data,
        order,
      },
    });
  }

  findAll() {
    return this.prisma.productCategory.findMany();
  }

  findOne(id: number) {
    return this.prisma.productCategory.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.prisma.productCategory.update({
      where: { id },
      data: UpdateProductCategoryData(updateProductCategoryDto),
    });
  }

  remove(id: number) {
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }

  async reorder(reorderProductCategoryDto: ReorderProductCategoryDto) {
    return await this.prisma.$transaction(
      reorderProductCategoryDto.items.map(({ id, order }) =>
        this.update(id, { order }),
      ),
    );
  }
}
