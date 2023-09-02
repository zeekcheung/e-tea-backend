import { BadRequestException } from '@nestjs/common';
import {
  isArray,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

export class ArrayItemsExistValidator implements ValidatorConstraintInterface {
  async validate(value: any[], args: ValidationArguments) {
    // @IsArray
    if (!isArray(value)) {
      return false;
    }
    // @ArrayNotEmpty
    if (!value.length) {
      return false;
    }

    const sourceArray = args.constraints[0];
    return value.every((item) => sourceArray.includes(item));
  }

  defaultMessage(args?: ValidationArguments): string {
    throw new BadRequestException(
      `All items in \`${args.property}\` must exist in [${args.value}]`,
    );
  }
}

export function ArrayItemsExist(
  sourceArray: any[],
  validationOptions?: ValidationOptions,
) {
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: 'ArrayItemsExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [sourceArray],
      validator: ArrayItemsExistValidator,
    });
  };
}
