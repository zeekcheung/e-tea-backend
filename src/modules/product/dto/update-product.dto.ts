import { PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export const UpdateProductData = ({
  categories,
  ...rest
}: UpdateProductDto) => {
  const data: Prisma.ProductUpdateInput = {
    ...rest,

    // 建立关联
    categories: {
      connect: categories.map((id) => ({ id })),
    },
  };

  return data;
};
