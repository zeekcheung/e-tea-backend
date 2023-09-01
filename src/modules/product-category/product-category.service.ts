import { xprisma } from '@/common/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { FindAllProductCategoriesDto } from './dto/find-all-product-categories.dto';
import { FindOneProductCategoryDto } from './dto/find-one-product-category.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor() { }

  async create({ shopId, products, ...rest }: CreateProductCategoryDto) {
    const maxOrder = await this.getMaxOrder(shopId);

    const category = await xprisma.productCategory.create({
      data: {
        ...rest,
        order: maxOrder + 1,
        shop: {
          connect: { id: shopId },
        },
      },
    });

    return this.connectOrCreateProducts(category.id, products);
  }

  findAll(findAllProductCategoriesDto: FindAllProductCategoriesDto = {}) {
    const { keyword = '', include = [] } = findAllProductCategoriesDto;

    // fuzzy search product categories and include relationships
    return xprisma.productCategory.findMany({
      where: {
        name: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.ProductCategoryInclude,
    });
  }

  findOne(
    id: number,
    findOneProductCategoryDto: FindOneProductCategoryDto = {},
  ) {
    const { keyword = '', include = [] } = findOneProductCategoryDto;

    return xprisma.productCategory.findUnique({
      where: { id, name: { contains: keyword } },
      include: transformIncludeKeys(include) as Prisma.ProductCategoryInclude,
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
    const category = await xprisma.productCategory.update({
      where: { id },
      data: rest,
    });

    await this.connectOrCreateProducts(category.id, addProducts);

    await this.disconnectProducts(category.id, removeProducts);

    return category;
  }

  remove(id: number) {
    return xprisma.productCategory.delete({
      where: { id },
    });
  }

  async reorder(reorderProductCategoryDto: ReorderProductCategoryDto) {
    return await xprisma.$transaction(
      reorderProductCategoryDto.items.map(({ id, order }) =>
        xprisma.productCategory.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }

  async getMaxOrder(shopId: number) {
    const maxOrderProductCategory = await xprisma.productCategory.findFirst({
      where: { shopId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return maxOrderProductCategory ? maxOrderProductCategory.order : 0;
  }

  async connectOrCreateProducts(
    id: number,
    products: CreateProductCategoryDto['products'],
  ) {
    return xprisma.productCategory.update({
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
    return xprisma.productCategory.update({
      where: { id },
      data: {
        products: {
          disconnect: products.map((id) => ({ id })),
        },
      },
    });
  }
}
