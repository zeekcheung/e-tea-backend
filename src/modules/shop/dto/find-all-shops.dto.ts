import { ShopRelationKeys } from '@/common/constant/dto';
import { ArrayItemsExist } from '@/common/validators/ArrayItemsExist.validator';
import { IsOptional, IsString } from 'class-validator';

export class FindAllShopsDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @ArrayItemsExist(ShopRelationKeys)
  @IsOptional()
  include?: string[];
}
