import { OmitType, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';
import { classifyIdAndDto } from '../../../utils/common';
import { IsUnionArray } from '../../../validators/IsUnionArrayValidator';
import { CreateProductCategoryDto } from '../../product-category/dto/create-product-category.dto';
import { ProductCategoryService } from '../../product-category/product-category.service';
import { CreateProductSpecificationDto } from '../../product-specification/dto/create-product-specification.dto';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['categories', 'specifications']),
) {
  @IsUnionArray(['number', CreateProductCategoryDto])
  @ArrayNotEmpty()
  @IsOptional()
  addCategories?: CreateProductDto['categories'];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  removeCategories?: number[];

  @IsUnionArray(['number', CreateProductSpecificationDto])
  @ArrayNotEmpty()
  @IsOptional()
  addSpecifications?: CreateProductDto['specifications'];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  removeSpecifications?: number[];
}

export const UpdateProductData = async (
  productCategoryService: ProductCategoryService,
  {
    shopId,
    addCategories = [],
    addSpecifications = [],
    removeCategories = [],
    removeSpecifications = [],
    ...rest
  }: UpdateProductDto,
  productId: number,
) => {
  shopId = shopId || (await productCategoryService.findOne(productId)).id;
  // 拆分 id 和 createDto
  const [addCategoryIdArray, addCategoryDtoArray] =
    classifyIdAndDto(addCategories);
  const [addSpecificationIdArray, adSspecificationDtoArray] =
    classifyIdAndDto(addSpecifications);
  // 获取当前分类最大的 order
  let maxCategoryOrder =
    addCategories.length > 0
      ? await productCategoryService.getMaxOrder(shopId)
      : 0;

  const data: Prisma.ProductUpdateInput = {
    ...rest,

    // 建立关联
    categories: {
      connect: addCategoryIdArray.map((id) => ({ id })),
      create: addCategoryDtoArray.map(({ name, description }) => ({
        name,
        description,
        order: ++maxCategoryOrder,
        shopId,
      })),
      disconnect: removeCategories.map((id) => ({ id })),
    },
    specifications: {
      connect: addSpecificationIdArray.map((id) => ({ id })),
      create: adSspecificationDtoArray.map(({ tag, name, price }) => ({
        tag,
        name,
        price,
      })),
      disconnect: removeSpecifications.map((id) => ({ id })),
    },
  };

  return data;
};
