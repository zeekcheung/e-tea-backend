import { BadRequestException } from '@nestjs/common';
import {
  isArray,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ArrayItemsExist', async: false })
export class ArrayItemsExistValidator implements ValidatorConstraintInterface {
  async validate(value: any[], args: ValidationArguments) {
    // @IsArray
    if (!isArray(value)) {
      return false;
    }
    if (!value.length) {
      return true;
    }

    const sourceArray = args.constraints[0];
    return value.every((item) => sourceArray.includes(item));
  }

  defaultMessage(args?: ValidationArguments): string {
    throw new BadRequestException(
      `All items in \`${args.property}\` must exist in [${args.constraints[0]
        .map((key: string) => `'${key}'`)
        .join(', ')}]`,
    );
  }
}

/**
 * Check if all items in the array exists in the source array
 * @param sourceArray
 * @param validationOptions
 */
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
