import { Prisma, ProductCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  name: ProductCategory['name'];

  @IsString()
  @MaxLength(50)
  @IsOptional()
  description?: ProductCategory['description'];

  @IsInt()
  @IsNotEmpty()
  shopId: ProductCategory['shopId'];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @IsOptional()
  products: number[];
}

export const CreateProductCategoryData = ({
  shopId,
  products = [],
  ...rest
}: CreateProductCategoryDto & { order: number }) => {
  const data: Prisma.ProductCategoryCreateInput = {
    ...rest,

    // 建立关联
    shop: {
      connect: { id: shopId },
    },
    products: {
      connect: products.map((id) => ({ id })),
    },
  };

  return data;
};
