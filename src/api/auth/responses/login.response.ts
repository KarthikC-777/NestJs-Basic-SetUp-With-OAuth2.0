import { PickType } from '@nestjs/swagger';
import { AccessTokenResponse } from './access-token.response';

export class LoginResponse extends PickType(AccessTokenResponse, [
  'accessToken',
  'deleteDate',
  'refreshToken',
  'expiresIn',
  'tokenType',
]) {}
