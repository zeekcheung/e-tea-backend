import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  CREATE_PRODUCT_CATEGORY_REQUIRED_KEYS,
  CREATE_PRODUCT_SPECIFICATION_REQUIRED_KEYS,
} from '../../../common/constant/dto';
import { IsConnectOrCreateItems } from '../../../common/validators/IsConnectOrCreateItems.validator';
import { AddProductCategoriesItem } from '../../product-category/dto/create-product-category.dto';
import { AddProductSpecificationsItem } from '../../product-specification/dto/create-product-specification.dto';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends OmitType(PartialType(CreateProductDto), [
  'categories',
  'specifications',
]) {
  @IsConnectOrCreateItems(CREATE_PRODUCT_CATEGORY_REQUIRED_KEYS)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductCategoriesItem)
  addCategories?: AddProductCategoriesItem[];

  @IsConnectOrCreateItems(CREATE_PRODUCT_SPECIFICATION_REQUIRED_KEYS)
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
