import {
  CreateProductCategoryRequiredKeys,
  CreateProductSpecificationRequiredKeys,
} from '@/common/constant/dto';
import { IsConnectOrCreateItems } from '@/common/validators/IsConnectOrCreateItems.validator';
import { AddProductCategoriesItem } from '@/modules/product-category/dto/create-product-category.dto';
import { AddProductSpecificationsItem } from '@/modules/product-specification/dto/create-product-specification.dto';
import { OmitType } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: Product['name'];

  @IsUrl()
  @IsNotEmpty()
  imageUrl: Product['imageUrl'];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: Product['description'];

  @IsInt()
  @IsOptional()
  stock?: Product['stock'];

  @IsBoolean()
  @IsOptional()
  isExchangeable?: Product['isExchangeable'];

  @IsInt()
  @Min(0)
  @IsOptional()
  exchangeLimit?: Product['exchangeLimit'];

  @IsNumber()
  @Min(0)
  @IsOptional()
  exchangeCost?: Product['exchangeCost'];

  @IsInt()
  @IsNotEmpty()
  shopId: Product['shopId'];

  @IsConnectOrCreateItems(CreateProductCategoryRequiredKeys)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductCategoriesItem)
  categories?: AddProductCategoriesItem[];

  @IsConnectOrCreateItems(CreateProductSpecificationRequiredKeys)
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddProductSpecificationsItem)
  specifications?: AddProductSpecificationsItem[];
}

export class AddProductsItem extends OmitType(CreateProductDto, [
  'categories',
  'specifications',
]) {
  @IsInt()
  @IsOptional()
  id: Product['id'];
}
