import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CreateProductRequiredKeys } from '@/common/constant/dto';
import { CreateProductSpecificationDto } from './create-product-specification.dto';
import { IsOptional } from '@/common/validators/IsOptional.validator';

export class UpdateProductSpecificationDto extends PartialType(
  OmitType(CreateProductSpecificationDto, ['products']),
) {
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
