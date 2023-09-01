import { UserRelationKeys } from '@/common/constant/dto';
import { ArrayItemsExist } from '@/common/validators/ArrayItemsExist.validator';
import { IsOptional, IsString } from 'class-validator';

export class FindAllUsersDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @ArrayItemsExist(UserRelationKeys)
  @IsOptional()
  include?: string[];
}
