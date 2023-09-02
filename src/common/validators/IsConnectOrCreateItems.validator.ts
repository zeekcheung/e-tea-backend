import { BadRequestException } from '@nestjs/common';
import {
  arrayNotEmpty,
  isArray,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUnionArray', async: false })
export class IsConnectOrCreateItemsValidator
  implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // @IsArray
    if (!isArray(value)) {
      return false;
    }
    if (!arrayNotEmpty(value)) {
      return true;
    }
    const createRequiredKeys = args.constraints[0];
    value.forEach((item, i) => {
      // whether the item has all the required keys when id is not exist
      if (!item.id) {
        createRequiredKeys.forEach((key: string) => {
          if (item[key] === undefined) {
            throw new BadRequestException(
              `${args.property}[${i}].${key} is required`,
            );
          }
        });
      }
    });
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Items in \`${args.property}\` must contains the required keys: [${args.constraints[0]}]`;
  }
}

export function IsConnectOrCreateItems<T>(
  createRequiredKeys: Array<keyof T>,
  validationOptions?: ValidationOptions,
) {
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: 'isUnionArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [createRequiredKeys],

      options: validationOptions,
      validator: IsConnectOrCreateItemsValidator,
    });
  };
}
