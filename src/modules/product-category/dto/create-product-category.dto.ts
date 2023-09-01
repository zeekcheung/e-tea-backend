import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { OmitType } from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateProductRequiredKeys } from '@/common/constant/dto';

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

  @IsConnectOrCreateItems(CreateProductRequiredKeys)
  @ValidateNested({ each: true })
  @Type(() => AddProductsItem)
  @IsOptional()
  products?: AddProductsItem[];
}

export class AddProductCategoriesItem extends OmitType(
  CreateProductCategoryDto,
  ['products'],
) {
  @IsInt()
  @IsOptional()
  id: ProductCategory['id'];
}
