import type { Prisma, Shop } from '@prisma/client';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  @IsLatitude({
    message: 'latitude must be a latitude number',
  })
  @IsNotEmpty()
  latitude: Shop['latitude'];

  @IsNumber()
  @IsLongitude({
    message: 'longitude must be a longitude number',
  })
  @IsNotEmpty()
  longitude: Shop['longitude'];

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  address: Shop['address'];

  @IsInt()
  @IsNotEmpty()
  shopKeeperId: Shop['shopKeeperId'];
}

export const CreateShopData = ({ shopKeeperId, ...rest }: CreateShopDto) => {
  const data: Prisma.ShopCreateInput = {
    ...rest,

    // 建立关联
    shopKeeper: {
      connect: { id: shopKeeperId },
    },
  };

  return data;
};
