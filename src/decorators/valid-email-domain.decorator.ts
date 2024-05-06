import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsCodeAndTheoryDomain(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCodeAndTheoryDomainConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsCodeAndTheoryDomain' })
export class IsCodeAndTheoryDomainConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown): boolean | Promise<boolean> {
    if (typeof value !== 'string') {
      return false;
    }

    // Split the email at the '@' symbol
    const parts = value.toLowerCase().trim().split('@');

    // Check if the domain part is codeandtheory.com
    return parts.length === 2 && parts[1] === 'codeandtheory.com';
  }
}
