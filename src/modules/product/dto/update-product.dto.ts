import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import {
  CreateProductCategoryRequiredKeys,
  CreateProductSpecificationRequiredKeys,
} from '@/common/constant/dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { AddProductCategoriesItem } from '@/modules/product-category/dto/create-product-category.dto';
import { AddProductSpecificationsItem } from '@/modules/product-specification/dto/create-product-specification.dto';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from '@/common/validators/IsOptional.validator';

export class UpdateProductDto extends OmitType(PartialType(CreateProductDto), [
  'categories',
  'specifications',
]) {
  @IsConnectOrCreateItems(CreateProductCategoryRequiredKeys)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductCategoriesItem)
  addCategories?: AddProductCategoriesItem[];

  @IsConnectOrCreateItems(CreateProductSpecificationRequiredKeys)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductSpecificationsItem)
  addSpecifications?: AddProductSpecificationsItem[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsOptional()
  removeCategories?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsOptional()
  removeSpecifications?: number[];
}
