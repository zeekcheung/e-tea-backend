import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProductCategoryService } from '../product-category/product-category.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  async create({
    shopId,
    categories = [],
    specifications = [],
    ...rest
  }: CreateProductDto) {
    // 创建实体
    const product = await this.prisma.product.create({
      data: {
        ...rest,
        shop: {
          connect: { id: shopId },
        },
      },
    });

    // 建立关联
    await this.connectOrCreateProductCategories(product.id, categories);
    await this.connectOrCreateProductSpecifications(product.id, specifications);

    return product;
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { shop: true },
    });
  }

  async update(
    id: number,
    {
      shopId,
      addCategories = [],
      addSpecifications = [],
      removeCategories = [],
      removeSpecifications = [],
      ...rest
    }: UpdateProductDto,
  ) {
    await this.prisma.product.update({
      where: { id },
      // 更新实体
      data: rest,
    });

    // 建立关联
    await this.connectOrCreateProductCategories(id, addCategories);
    await this.connectOrCreateProductSpecifications(id, addSpecifications);
    // 断开关联
    await this.disconnectProductCategories(id, removeCategories);
    const res = await this.disconnectProductSpecifications(
      id,
      removeSpecifications,
    );
    return res;
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  async connectOrCreateProductCategories(
    id: number,
    categories: CreateProductDto['categories'],
  ) {
    const product = await this.findOne(id);
    const shopId = product.shopId;

    // 获取当前分类最大的 order
    const maxCategoryOrder = await this.productCategoryService.getMaxOrder(
      shopId,
    );

    return this.prisma.product.update({
      where: { id },
      data: {
        categories: {
          connectOrCreate: categories.map(({ id, shopId, ...rest }) => {
            return {
              where: { id: id ?? -1 },
              create: {
                ...rest,
                order: maxCategoryOrder,
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

  connectOrCreateProductSpecifications(
    id: number,
    specifications: CreateProductDto['specifications'],
  ) {
    return this.prisma.product.update({
      where: { id },
      data: {
        specifications: {
          connectOrCreate: specifications.map(({ id, ...rest }) => {
            return {
              where: { id },
              create: {
                ...rest,
              },
            };
          }),
        },
      },
    });
  }

  disconnectProductCategories(
    id: number,
    categories: UpdateProductDto['removeCategories'],
  ) {
    return this.prisma.product.update({
      where: { id },
      data: {
        categories: {
          disconnect: categories.map((id) => ({ id })),
        },
      },
    });
  }

  disconnectProductSpecifications(
    id: number,
    specifications: UpdateProductDto['removeSpecifications'],
  ) {
    return this.prisma.product.update({
      where: { id },
      data: {
        specifications: {
          disconnect: specifications.map((id) => ({ id })),
        },
      },
    });
  }
}
