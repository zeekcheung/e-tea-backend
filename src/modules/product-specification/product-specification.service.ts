import { xprisma } from '@/common/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductCategoryDto } from '../product-category/dto/create-product-category.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { FindAllProductSpecificationsDto } from './dto/find-all-product-specifications.dto';
import { FindOneProductSpecificationDto } from './dto/find-one-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationService {
  constructor() { }

  create({ products, ...rest }: CreateProductSpecificationDto) {
    return xprisma.productSpecification.create({
      data: {
        ...rest,
      },
    });
  }

  findAll(
    findAllProductSpecificationsDto: FindAllProductSpecificationsDto = {},
  ) {
    const { keyword = '', include = [] } = findAllProductSpecificationsDto;

    //  fuzzy search product specification and include relationships
    return xprisma.productSpecification.findMany({
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
  ) {
    const { keyword = '', include = [] } = findOneProductSpecificationDto;

    return xprisma.productSpecification.findUnique({
      where: { id, name: { contains: keyword } },
      include: transformIncludeKeys(
        include,
      ) as Prisma.ProductSpecificationInclude,
    });
  }

  async update(
    id: number,
    { addProducts, removeProducts, ...rest }: UpdateProductSpecificationDto,
  ) {
    const specification = xprisma.productSpecification.update({
      where: { id },
      data: rest,
    });

    await this.connectOrCreateProducts(id, addProducts);

    await this.disconnectProducts(id, removeProducts);

    return specification;
  }

  remove(id: number) {
    return xprisma.productSpecification.delete({
      where: { id },
    });
  }

  async connectOrCreateProducts(
    id: number,
    products: CreateProductCategoryDto['products'] = [],
  ) {
    if (products.length === 0) {
      return;
    }

    return xprisma.productCategory.update({
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
  ) {
    if (products.length === 0) {
      return;
    }

    return xprisma.productSpecification.update({
      where: { id },
      data: {
        products: {
          disconnect: products.map((id) => ({ id })),
        },
      },
    });
  }
}
