import { CreateProductRequiredKeys } from '@/common/constant/dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { IsOptional } from '@/common/validators/IsOptional.validator';
import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { OmitType } from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
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
  id?: ProductCategory['id'];
}
