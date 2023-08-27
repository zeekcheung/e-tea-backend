import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUnionArray', async: false })
export class IsUnionArrayValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    const [allowedTypes] = args.constraints;

    // 验证数组中的每个元素是否符合联合类型的要求

    for (const element of value) {
      let isValid = false;

      for (const allowedType of allowedTypes) {
        if (typeof allowedType === 'string') {
          if (allowedType === 'string' && typeof element === 'string') {
            isValid = true;
            break;
          } else if (allowedType === 'number' && typeof element === 'number') {
            isValid = true;
            break;
          } else if (
            allowedType === 'boolean' &&
            typeof element === 'boolean'
          ) {
            isValid = true;
            break;
          } else if (allowedType === 'symbol' && typeof element === 'symbol') {
            isValid = true;
            break;
          }
        } else if (element instanceof allowedType) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        return false;
      }
    }

    return true;
  }

  defaultMessage() {
    return 'The array contains invalid elements.';
  }
}

export function IsUnionArray(
  allowedTypes: (object | 'string' | 'number' | 'boolean' | 'symbol')[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUnionArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedTypes],

      options: validationOptions,
      validator: IsUnionArrayValidator,
    });
  };
}
