import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotNull', async: false })
export class IsNotNullValidator implements ValidatorConstraintInterface {
  async validate(value: any[], _args: ValidationArguments) {
    return value !== null;
  }

  defaultMessage(args?: ValidationArguments): string {
    throw new BadRequestException(`\`${args.property}\` must not be null`);
  }
}

/**
 * Check if value is not null
 */
export function IsNotNull(validationOptions?: ValidationOptions) {
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNotNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotNullValidator,
    });
  };
}
