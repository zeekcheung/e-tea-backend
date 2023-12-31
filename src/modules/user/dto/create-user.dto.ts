import { Role } from '@/types/model';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  openid: User['openid'];

  @IsString()
  @Exclude()
  sessionKey: User['sessionKey'];

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: User['phone'];

  @IsString()
  @IsOptional()
  nickname?: User['nickname'];

  @IsUrl()
  @IsOptional()
  avatarUrl?: User['avatarUrl'];
}
