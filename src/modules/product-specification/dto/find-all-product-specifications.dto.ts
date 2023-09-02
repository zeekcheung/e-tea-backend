import { ProductSpecificationRelationKeys } from '@/common/constant/dto';
import { ArrayItemsExist } from '@/common/validators/ArrayItemsExist.validator';
import { IsOptional } from '@/common/validators/IsOptional.validator';
import { IsString } from 'class-validator';

export class FindAllProductSpecificationsDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @ArrayItemsExist(ProductSpecificationRelationKeys)
  @IsOptional()
  include?: string[];
}
