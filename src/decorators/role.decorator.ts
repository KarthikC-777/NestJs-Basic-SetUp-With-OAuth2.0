import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from '../api/user/enums/user-designation.enum';

export const ROLES_KEY = 'employee_roles';
export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
