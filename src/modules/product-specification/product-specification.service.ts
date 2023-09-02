import { xprisma } from '@/common/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductCategoryDto } from '../product-category/dto/create-product-category.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { FindAllProductSpecificationsDto } from './dto/find-all-product-specifications.dto';
import { FindOneProductSpecificationDto } from './dto/find-one-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import {
  PrismaClientInTransaction,
  PrismaClientWithExtensions,
} from '@/types/prisma/client';

@Injectable()
export class ProductSpecificationService {
  constructor() { }

  async create(
    { products, ...rest }: CreateProductSpecificationDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (await this.specificationExists(rest)) {
      throw new ConflictException('Product specification already exists');
    }

    try {
      return tx.$transaction(async (_tx: PrismaClientInTransaction) => {
        const specification = await _tx.productSpecification.create({
          data: {
            ...rest,
          },
        });

        await this.connectOrCreateProducts(specification.id, products, _tx);

        return specification;
      });
    } catch (error) {
      console.log({ error });
      throw new Prisma.PrismaClientKnownRequestError(error.message, error);
    }
  }

  findAll(
    findAllProductSpecificationsDto: FindAllProductSpecificationsDto = {},
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const { keyword = '', include = [] } = findAllProductSpecificationsDto;

    //  fuzzy search product specification and include relationships
    return tx.productSpecification.findMany({
      where: {
        name: { contains: keyword },
      },
      include: transformIncludeKeys(
        include,
      ) as Prisma.ProductSpecificationInclude,
    });
  }

  findOne(
    id: number,
    findOneProductSpecificationDto: FindOneProductSpecificationDto = {},
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    const { keyword = '', include = [] } = findOneProductSpecificationDto;

    return tx.productSpecification.findUnique({
      where: { id, name: { contains: keyword } },
      include: transformIncludeKeys(
        include,
      ) as Prisma.ProductSpecificationInclude,
    });
  }

  async update(
    id: number,
    { addProducts, removeProducts, ...rest }: UpdateProductSpecificationDto,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    try {
      return tx.$transaction(async (_tx: PrismaClientInTransaction) => {
        const specification = await _tx.productSpecification.update({
          where: { id },
          data: rest,
        });

        await this.connectOrCreateProducts(id, addProducts, _tx);

        await this.disconnectProducts(id, removeProducts, _tx);

        return specification;
      });
    } catch (error) {
      console.log(error);
      throw new Prisma.PrismaClientKnownRequestError(error.message, error);
    }
  }

  remove(
    id: number,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    return tx.productSpecification.delete({
      where: { id },
    });
  }

  async specificationExists(
    args: Prisma.ProductSpecificationWhereInput,
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    return (await tx.productSpecification.findFirst({ where: args })) !== null;
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
    products: UpdateProductSpecificationDto['removeProducts'] = [],
    tx: PrismaClientInTransaction | PrismaClientWithExtensions = xprisma,
  ) {
    if (products.length === 0) {
      return;
    }

    return tx.productSpecification.update({
      where: { id },
      data: {
        products: {
          disconnect: products.map((id) => ({ id })),
        },
      },
    });
  }
}
