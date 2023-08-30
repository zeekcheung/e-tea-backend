import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductCategoryDto } from '../product-category/dto/create-product-category.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationService {
  constructor(private readonly prisma: PrismaService) { }

  create({ products, ...rest }: CreateProductSpecificationDto) {
    return this.prisma.productSpecification.create({
      data: {
        ...rest,
      },
    });
  }

  findAll() {
    return this.prisma.productSpecification.findMany();
  }

  findOne(id: number) {
    return this.prisma.productSpecification.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    { addProducts, removeProducts, ...rest }: UpdateProductSpecificationDto,
  ) {
    const specification = this.prisma.productSpecification.update({
      where: { id },
      data: rest,
    });
    // 建立关联
    await this.connectOrCreateProducts(id, addProducts);
    // 断开关联
    await this.disconnectProducts(id, removeProducts);
    return specification;
  }

  remove(id: number) {
    return this.prisma.productSpecification.delete({
      where: { id },
    });
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
    products: UpdateProductSpecificationDto['removeProducts'],
  ) {
    return this.prisma.productSpecification.update({
      where: { id },
      data: {
        products: {
          disconnect: products.map((id) => ({ id })),
        },
      },
    });
  }
}
