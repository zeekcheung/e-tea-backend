import { CreateProductRequiredKeys } from '@/common/constant/dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { IsOptional } from '@/common/validators/IsOptional.validator';
import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { OmitType } from '@nestjs/swagger';
import { ProductSpecification } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateProductSpecificationDto {
  @IsString()
  @IsNotEmpty()
  tag: ProductSpecification['tag'];

  @IsString()
  @IsNotEmpty()
  name: ProductSpecification['name'];

  @IsNumber()
  @IsNotEmpty()
  price: ProductSpecification['price'];

  @IsConnectOrCreateItems(CreateProductRequiredKeys)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductsItem)
  products?: AddProductsItem[];
}

export class AddProductSpecificationsItem extends OmitType(
  CreateProductSpecificationDto,
  ['products'],
) {
  @IsInt()
  @IsOptional()
  id?: ProductSpecification['id'];
}
