import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { Jwt } from '../config/jwt';
import { constructErrorMessage } from '../utils/response-message.util';
import { logger } from '../config/logger';

/**
 * Description :This middleware checks whether accessToken stored in cookie or not .
 * This middleware checks for below conditions:
 * 1 - should accessToken stored in cookie
 * 2 - should fetch details from auth collection when accessToken send it as query parameter
 * 3 - should not check for accessToken if guestUser is passed as true
 * @returns void
 * If above conditions fails it throws unauthorized exception
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwt: Jwt,
    private readonly configService: ConfigService,
  ) {}
  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // logger.log(`${this.constructor.name}.use: Inside auth middleware`);
      // check if guest user flag exists

      // check if token exist
      const accessTokenCookie = request.cookies['accessToken']; // check accessToken cookie is there

      if (!accessTokenCookie) {
        logger.warn(
          `${this.constructor.name}.use: Access not found in request cookie`,
        );

        throw new UnauthorizedException(constructErrorMessage('XHR_ERROR.401'));
      }

      //verify token is valid or not
      request.user = this.jwt.verify(accessTokenCookie);

      next();
    } catch (error) {
      // do not throw unauthorized error if guestUser is true in request

      logger.error(
        `${this.constructor.name}.AuthMiddleware : Error occurred in verifying jwt`,
        error,
      );

      throw new UnauthorizedException(constructErrorMessage('XHR_ERROR.401'));
    }
  }
}
