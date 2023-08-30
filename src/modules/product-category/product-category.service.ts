import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UpdateProductDto } from '../product/dto/update-product.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create({ shopId, products, ...rest }: CreateProductCategoryDto) {
    const maxOrder = await this.getMaxOrder(shopId);
    const category = await this.prisma.productCategory.create({
      data: {
        ...rest,
        order: maxOrder + 1,
        shop: {
          connect: { id: shopId },
        },
      },
    });
    // 建立关联
    return this.connectOrCreateProducts(category.id, products);
  }

  findAll() {
    return this.prisma.productCategory.findMany();
  }

  findOne(id: number) {
    return this.prisma.productCategory.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    {
      addProducts = [],
      removeProducts = [],
      ...rest
    }: UpdateProductCategoryDto,
  ) {
    const category = await this.prisma.productCategory.update({
      where: { id },
      data: rest,
    });
    // 建立关联
    await this.connectOrCreateProducts(category.id, addProducts);
    // 断开关联
    await this.disconnectProducts(category.id, removeProducts);
    return category;
  }

  remove(id: number) {
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }

  async reorder(reorderProductCategoryDto: ReorderProductCategoryDto) {
    return await this.prisma.$transaction(
      reorderProductCategoryDto.items.map(({ id, order }) =>
        this.prisma.productCategory.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }

  async getMaxOrder(shopId: number) {
    const maxOrderProductCategory = await this.prisma.productCategory.findFirst(
      {
        where: { shopId },
        orderBy: { order: 'desc' },
        select: { order: true },
      },
    );
    return maxOrderProductCategory ? maxOrderProductCategory.order : 0;
  }

  async connectOrCreateProducts(
    id: number,
    products: CreateProductCategoryDto['products'],
  ) {
    return this.prisma.productCategory.update({
      where: { id },
      data: {
        products: {
          connectOrCreate: products.map(({ id, shopId, ...rest }) => {
            return {
              where: { id },
              create: {
                ...rest,
                shop: {
                  connect: { id: shopId },
                },
              },
            };
          }),
        },
      },
    });
  }

  disconnectProducts(
    id: number,
    products: UpdateProductDto['removeCategories'],
  ) {
    return this.prisma.productCategory.update({
      where: { id },
      data: {
        products: {
          disconnect: products.map((id) => ({ id })),
        },
      },
    });
  }
}
