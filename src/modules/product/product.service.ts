import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ProductCategoryService } from '../product-category/product-category.service';
import { CreateProductData, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductData, UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: await CreateProductData(
        this.prisma,
        this.productCategoryService,
        createProductDto,
      ),
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: await UpdateProductData(
        this.productCategoryService,
        updateProductDto,
        id,
      ),
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
