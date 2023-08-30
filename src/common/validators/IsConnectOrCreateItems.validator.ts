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

export type ClassType = new (...args: any[]) => any;

@ValidatorConstraint({ name: 'IsUnionArray', async: false })
export class IsConnectOrCreateItemsValidator
  implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // @IsArray
    if (!isArray(value)) {
      return false;
    }
    // @ArrayNotEmpty
    if (!arrayNotEmpty(value)) {
      return false;
    }
    const createRequiredKeys = args.constraints[0];
    value.forEach((item, i) => {
      // 当 id 不存在时, item 是否包含所有必须字段
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
    return `${args.property} must be an array of [${args.constraints[0].map(
      (c: ClassType) => c.name,
    )}]`;
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
