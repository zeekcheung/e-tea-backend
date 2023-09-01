import { ProductRelationKeys } from '@/common/constant/dto';
import { ArrayItemsExist } from '@/common/validators/ArrayItemsExist.validator';
import { IsOptional, IsString } from 'class-validator';

export class FindAllProductsDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @ArrayItemsExist(ProductRelationKeys)
  @IsOptional()
  include?: string[];
}
