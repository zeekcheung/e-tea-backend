import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Role } from '../../../types/common';

export class CreateUserDto {
  @IsPhoneNumber('CN')
  @IsNotEmpty()
  phone: string;

  @IsStrongPassword({ minLength: 8 })
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
