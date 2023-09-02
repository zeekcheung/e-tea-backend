import { xprisma } from '@/common/prisma/client';
import {
  PrismaClientInTransaction,
  PrismaClientWithExtensions,
} from '@/types/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(
    { shopId, products, name, description }: CreateProductCategoryDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (await this.categoryExists({ name, shopId })) {
      throw new ConflictException('Category already exists');
    }

    try {
      return await tx.$transaction(async (_tx: PrismaClientInTransaction) => {
        const maxOrder = await this.getMaxOrder(shopId, _tx);

        const category = await _tx.productCategory.create({
          data: {
            name,
            description,
            order: maxOrder + 1,
            shop: {
              connect: { id: shopId },
            },
          },
        });

        await this.connectOrCreateProducts(category.id, products, _tx);

        return category;
      });
    } catch (error) {
      console.log({ error });
      throw new Prisma.PrismaClientKnownRequestError(error.message, error);
    }
  }

  findAll(
    findAllProductCategoriesDto: FindAllProductCategoriesDto = {},
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const { keyword = '', include = [] } = findAllProductCategoriesDto;

    // fuzzy search product categories and include relationships
    return tx.productCategory.findMany({
      where: {
        name: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.ProductCategoryInclude,
    });
  }

  findOne(
    id: number,
    findOneProductCategoryDto: FindOneProductCategoryDto = {},
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const { keyword = '', include = [] } = findOneProductCategoryDto;

    return tx.productCategory.findUnique({
      where: { id, name: { contains: keyword } },
      include: transformIncludeKeys(include) as Prisma.ProductCategoryInclude,
    });
  }

  async update(
    id: number,
    { addProducts, removeProducts, ...rest }: UpdateProductCategoryDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    try {
      return await tx.$transaction(async (_tx: PrismaClientInTransaction) => {
        const category = await _tx.productCategory.update({
          where: { id },
          data: rest,
        });

        await this.connectOrCreateProducts(category.id, addProducts, _tx);

        await this.disconnectProducts(category.id, removeProducts, _tx);

        return category;
      });
    } catch (error) {
      console.log({ error });
      throw new Prisma.PrismaClientKnownRequestError(error.message, error);
    }
  }

  remove(
    id: number,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    return tx.productCategory.delete({
      where: { id },
    });
  }

  async reorder(
    reorderProductCategoryDto: ReorderProductCategoryDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    return await tx.$transaction(
      reorderProductCategoryDto.items.map(({ id, order }) =>
        tx.productCategory.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }

  async getMaxOrder(
    shopId: number,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const maxOrderProductCategory = await tx.productCategory.findFirst({
      where: { shopId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return maxOrderProductCategory ? maxOrderProductCategory.order : 0;
  }

  async categoryExists(
    args: Prisma.ProductCategoryWhereInput,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    return (await tx.productCategory.findFirst({ where: args })) !== null;
  }

  async connectOrCreateProducts(
    id: number,
    products: CreateProductCategoryDto['products'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (products.length === 0) {
      return;
    }

    return tx.productCategory.update({
      where: { id },
      data: {
        products: {
          connectOrCreate: products.map(({ id, shopId, ...rest }) => {
            return {
              where: { id: id ?? -1 },
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
    products: UpdateProductDto['removeCategories'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (products.length === 0) {
      return;
    }

    return tx.productCategory.update({
      where: { id },
      data: {
        products: {
          disconnect: products.map((id) => ({ id })),
        },
      },
    });
  }
}
