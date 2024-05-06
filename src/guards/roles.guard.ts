import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { logger } from '../config/logger';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserRole } from '../api/user/enums/user-designation.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    logger.log(`${this.constructor.name}.canActivate: Inside route guard`);
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // // if route roles are not there return true
    if (!requiredRoles) {
      logger.debug(
        `${this.constructor.name}.canActivate: No roles present for this route`,
      );
      return true;
    }
    // get the request role
    const request: Request = context.switchToHttp().getRequest();
    // if user does not exist in request object then return false
    if (!request.user) {
      logger.error(
        `${
          this.constructor.name
        }.canActivate: Auth middleware is not added in this route : ${
          request.baseUrl + request.path
        }`,
      );
      return false;
    }

    // check if the role matches with the role admin from access token
    return requiredRoles.some((role) => request.user.role.includes(role));
  }
}
