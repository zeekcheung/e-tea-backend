import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { CREATE_PRODUCT_REQUIRED_KEYS } from '@/common/constant/dto';

export class UpdateProductCategoryDto extends PartialType(
  OmitType(CreateProductCategoryDto, ['shopId', 'products']),
) {
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsConnectOrCreateItems(CREATE_PRODUCT_REQUIRED_KEYS)
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
