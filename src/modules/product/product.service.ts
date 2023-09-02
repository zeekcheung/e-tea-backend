import { xprisma } from '@/common/prisma/client';
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

  async create({
    shopId,
    categories,
    specifications,
    ...rest
  }: CreateProductDto) {
    const product = await xprisma.product.create({
      data: {
        ...rest,
        shop: {
          connect: { id: shopId },
        },
      },
    });

    await this.connectOrCreateProductCategories(product.id, categories);
    await this.connectOrCreateProductSpecifications(product.id, specifications);

    return product;
  }

  findAll(findAllProductsDto: FindAllProductsDto = {}) {
    const { keyword = '', include = [] } = findAllProductsDto;

    return xprisma.product.findMany({
      where: {
        name: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.ProductInclude,
    });
  }

  findOne(id: number, findOneProductDto: FindOneProductDto = {}) {
    const { keyword = '', include = [] } = findOneProductDto;

    return xprisma.product.findUnique({
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
  ) {
    const product = await xprisma.product.update({
      where: { id },
      data: rest,
    });

    await this.connectOrCreateProductCategories(id, addCategories);
    await this.connectOrCreateProductSpecifications(id, addSpecifications);

    await this.disconnectProductCategories(id, removeCategories);
    await this.disconnectProductSpecifications(id, removeSpecifications);

    return product;
  }

  remove(id: number) {
    return xprisma.product.delete({ where: { id } });
  }

  async connectOrCreateProductCategories(
    id: number,
    categories: CreateProductDto['categories'] = [],
  ) {
    if (categories.length === 0) {
      return;
    }

    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`product id:${id} not found`);
    }

    const shopId = product.shopId;

    let maxCategoryOrder = await this.productCategoryService.getMaxOrder(
      shopId,
    );

    return xprisma.product.update({
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
  ) {
    if (specifications.length === 0) {
      return;
    }

    return xprisma.product.update({
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
  ) {
    if (categories.length === 0) {
      return;
    }

    return xprisma.product.update({
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
  ) {
    if (specifications.length === 0) {
      return;
    }

    return xprisma.product.update({
      where: { id },
      data: {
        specifications: {
          disconnect: specifications.map((id) => ({ id })),
        },
      },
    });
  }
}
