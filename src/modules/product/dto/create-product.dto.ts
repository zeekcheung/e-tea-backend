import { Prisma, Product } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @IsOptional()
  categories?: number[];
}

export const CreateProductData = ({
  shopId,
  categories = [],
  ...rest
}: CreateProductDto) => {
  const data: Prisma.ProductCreateInput = {
    ...rest,

    // 建立关联
    shop: {
      connect: { id: shopId },
    },
    categories: {
      connect: categories.map((id) => ({ id })),
    },
  };

  return data;
};
