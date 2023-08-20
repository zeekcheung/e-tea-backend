import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../../types/common';

export class LoginDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsString()
  @IsNotEmpty()
  appSecret: string;

  @IsString()
  @IsNotEmpty()
  loginCode: string;

  @IsString()
  @IsNotEmpty()
  getPhoneNumberCode: string;
}
