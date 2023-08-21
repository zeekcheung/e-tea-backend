import { ProductSpecification } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
