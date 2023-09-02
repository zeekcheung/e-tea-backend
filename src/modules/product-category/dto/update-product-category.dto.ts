import { CreateProductRequiredKeys } from '@/common/constant/dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { IsOptional } from '@/common/validators/IsOptional.validator';

export class UpdateProductCategoryDto extends PartialType(
  OmitType(CreateProductCategoryDto, ['shopId', 'products']),
) {
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsConnectOrCreateItems(CreateProductRequiredKeys)
  @ValidateNested({ each: true })
  @Type(() => AddProductsItem)
  @IsOptional()
  addProducts?: AddProductsItem[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsOptional()
  removeProducts?: number[];
}
