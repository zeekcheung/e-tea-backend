import { ProductCategoryRelationKeys } from '@/common/constant/dto';
import { ArrayItemsExist } from '@/common/validators/ArrayItemsExist.validator';
import { IsOptional, IsString } from 'class-validator';

export class FindAllProductCategoriesDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @ArrayItemsExist(ProductCategoryRelationKeys)
  @IsOptional()
  include?: string[];
}
