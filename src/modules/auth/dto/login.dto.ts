import { Role } from '@/types/model';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  loginCode: string;

  @IsString()
  @IsNotEmpty()
  getPhoneNumberCode: string;
}
