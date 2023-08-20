import { Prisma, Shop } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateShopDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: Shop['name'];

  @IsUrl()
  @IsNotEmpty()
  avatarUrl: Shop['avatarUrl'];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  introduction?: Shop['introduction'];

  // @IsNumber()
  // @Min(0.0)
  // @Max(5.0)
  // @IsOptional()
  // grade?: Shop['grade'];

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  address: Shop['address'];

  @IsInt()
  @IsNotEmpty()
  shopKeeperId: Shop['shopKeeperId'];
}

export const createShopData = ({ shopKeeperId, ...rest }: CreateShopDto) => {
  const data: Prisma.ShopCreateInput = {
    ...rest,

    // 建立关联
    shopKeeper: {
      connect: { id: shopKeeperId },
    },
  };

  return data;
};
