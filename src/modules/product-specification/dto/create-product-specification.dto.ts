import { AddProductsItem } from '@/modules/product/dto/create-product.dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { OmitType } from '@nestjs/swagger';
import { ProductSpecification } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CREATE_PRODUCT_REQUIRED_KEYS } from '@/common/constant/dto';

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

  @IsConnectOrCreateItems(CREATE_PRODUCT_REQUIRED_KEYS)
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
  id: ProductSpecification['id'];
}
