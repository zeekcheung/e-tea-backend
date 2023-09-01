import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { CreateProductSpecificationDto } from './create-product-specification.dto';
import { CreateProductRequiredKeys } from '@/common/constant/dto';

export class UpdateProductSpecificationDto extends PartialType(
  OmitType(CreateProductSpecificationDto, ['products']),
) {
  @IsConnectOrCreateItems(CreateProductRequiredKeys)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductsItem)
  addProducts?: AddProductsItem[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsOptional()
  removeProducts?: number[];
}
