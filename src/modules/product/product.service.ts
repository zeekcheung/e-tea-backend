import { xprisma } from '@/common/prisma/client';
import {
  PrismaClientInTransaction,
  PrismaClientWithExtensions,
} from '@/types/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductCategoryService } from '../product-category/product-category.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { FindOneProductDto } from './dto/find-one-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) { }

  async create(
    { shopId, categories, specifications, ...rest }: CreateProductDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    try {
      await tx.$transaction(async (_tx: PrismaClientInTransaction) => {
        const product = await _tx.product.create({
          data: {
            ...rest,
            shop: {
              connect: { id: shopId },
            },
          },
        });

        await this.connectOrCreateProductCategories(
          product.id,
          categories,
          _tx,
        );
        await this.connectOrCreateProductSpecifications(
          product.id,
          specifications,
          _tx,
        );

        return product;
      });
    } catch (err) {
      console.log({ err });
      throw new Prisma.PrismaClientKnownRequestError(err.message, err);
    }
  }

  findAll(
    findAllProductsDto: FindAllProductsDto = {},
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const { keyword = '', include = [] } = findAllProductsDto;

    return tx.product.findMany({
      where: {
        name: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.ProductInclude,
    });
  }

  findOne(
    id: number,
    findOneProductDto: FindOneProductDto = {},
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const { keyword = '', include = [] } = findOneProductDto;

    return tx.product.findUnique({
      where: { id, name: { contains: keyword } },
      include: transformIncludeKeys(include) as Prisma.ProductInclude,
    });
  }

  async update(
    id: number,
    {
      shopId,
      addCategories,
      addSpecifications,
      removeCategories,
      removeSpecifications,
      ...rest
    }: UpdateProductDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    try {
      return tx.$transaction(async (_tx: PrismaClientInTransaction) => {
        const product = await xprisma.product.update({
          where: { id },
          data: rest,
        });

        await this.connectOrCreateProductCategories(id, addCategories, _tx);
        await this.connectOrCreateProductSpecifications(
          id,
          addSpecifications,
          _tx,
        );

        await this.disconnectProductCategories(id, removeCategories, _tx);
        await this.disconnectProductSpecifications(
          id,
          removeSpecifications,
          _tx,
        );

        return product;
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
    return tx.product.delete({ where: { id } });
  }

  async connectOrCreateProductCategories(
    id: number,
    categories: CreateProductDto['categories'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (categories.length === 0) {
      return;
    }

    const product = await this.findOne(id, {}, tx);
    if (!product) {
      throw new NotFoundException(`product id:${id} not found`);
    }

    const shopId = product.shopId;

    let maxCategoryOrder = await this.productCategoryService.getMaxOrder(
      shopId,
      tx,
    );

    return tx.product.update({
      where: { id },
      data: {
        categories: {
          connectOrCreate: categories.map(({ id, shopId, ...rest }) => {
            return {
              where: { id: id ?? -1 },
              create: {
                ...rest,
                order: ++maxCategoryOrder,
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
    specifications: CreateProductDto['specifications'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (specifications.length === 0) {
      return;
    }

    return tx.product.update({
      where: { id },
      data: {
        specifications: {
          connectOrCreate: specifications.map(({ id, ...rest }) => {
            return {
              where: { id: id ?? -1 },
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
    categories: UpdateProductDto['removeCategories'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (categories.length === 0) {
      return;
    }

    return tx.product.update({
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
    specifications: UpdateProductDto['removeSpecifications'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (specifications.length === 0) {
      return;
    }

    return tx.product.update({
      where: { id },
      data: {
        specifications: {
          disconnect: specifications.map((id) => ({ id })),
        },
      },
    });
  }
}
