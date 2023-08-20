import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateProductCategoryDto } from './create-product-category.dto';

export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export const UpdateProductCategoryData = ({
  products,
  ...rest
}: UpdateProductCategoryDto) => {
  const data: Prisma.ProductCategoryUpdateInput = {
    ...rest,

    // 建立关联
    products: {
      connect: products.map((id) => ({ id })),
    },
  };

  return data;
};
