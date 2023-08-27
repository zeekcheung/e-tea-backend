import { Prisma, Product } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { PrismaService } from 'nestjs-prisma';
import { classifyIdAndDto } from '../../../utils/common';
import { IsUnionArray } from '../../../validators/IsUnionArrayValidator';
import { CreateProductCategoryDto } from '../../product-category/dto/create-product-category.dto';
import { ProductCategoryService } from '../../product-category/product-category.service';
import { CreateProductSpecificationDto } from '../../product-specification/dto/create-product-specification.dto';

export class CreateProductDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: Product['name'];

  @IsUrl()
  @IsNotEmpty()
  imageUrl: Product['imageUrl'];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: Product['description'];

  @IsInt()
  @IsOptional()
  stock?: Product['stock'];

  @IsBoolean()
  @IsOptional()
  isExchangeable?: Product['isExchangeable'];

  @IsInt()
  @Min(0)
  @IsOptional()
  exchangeLimit?: Product['exchangeLimit'];

  @IsNumber()
  @Min(0)
  @IsOptional()
  exchangeCost?: Product['exchangeCost'];

  @IsInt()
  @IsNotEmpty()
  shopId: Product['shopId'];

  // TODO: categories should support (id | Category)[]
  @IsUnionArray(['number', CreateProductCategoryDto])
  @ArrayNotEmpty()
  @IsOptional()
  categories?: (number | CreateProductCategoryDto)[];

  // TODO: specifications should support (id | Specification)[]
  @IsUnionArray(['number', CreateProductSpecificationDto])
  @ArrayNotEmpty()
  @IsOptional()
  specifications?: (number | CreateProductSpecificationDto)[];
}

export const CreateProductData = async (
  prisma: PrismaService,
  productCategoryService: ProductCategoryService,
  { shopId, categories = [], specifications = [], ...rest }: CreateProductDto,
) => {
  // 拆分 id 和 createDto
  const [categoryIdArray, categoryDtoArray] = classifyIdAndDto(categories);
  const [specificationIdArray, specificationDtoArray] =
    classifyIdAndDto(specifications);
  // 获取当前分类最大的 order
  let maxCategoryOrder = await productCategoryService.getMaxOrder(shopId);

  const data: Prisma.ProductCreateInput = {
    ...rest,

    // 建立关联
    shop: {
      connect: { id: shopId },
    },
    categories: {
      connect: categoryIdArray.map((id) => ({ id })),
      create: categoryDtoArray.map(({ name, description }) => ({
        name,
        description,
        order: ++maxCategoryOrder,
        shopId,
      })),
    },
    specifications: {
      connect: specificationIdArray.map((id) => ({ id })),
      create: specificationDtoArray.map(({ tag, name, price }) => ({
        tag,
        name,
        price,
      })),
    },
  };

  return data;
};
