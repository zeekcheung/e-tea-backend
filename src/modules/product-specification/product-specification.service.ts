import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductSpecificationDto: CreateProductSpecificationDto) {
    return this.prisma.productSpecification.create({
      data: createProductSpecificationDto,
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

  update(
    id: number,
    updateProductSpecificationDto: UpdateProductSpecificationDto,
  ) {
    return this.prisma.productSpecification.update({
      where: { id },
      data: updateProductSpecificationDto,
    });
  }

  remove(id: number) {
    return this.prisma.productSpecification.delete({
      where: { id },
    });
  }
}
