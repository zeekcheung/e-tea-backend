import { User } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Role } from '../../../types/common';

export class CreateUserDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  openid: User['openid'];

  @IsString()
  @IsNotEmpty()
  sessionKey: User['sessionKey'];

  @IsPhoneNumber('CN')
  @IsNotEmpty()
  phone: User['phone'];

  @IsString()
  @IsOptional()
  nickname?: User['nickname'];

  @IsUrl()
  @IsOptional()
  avatarUrl?: User['avatarUrl'];
}
