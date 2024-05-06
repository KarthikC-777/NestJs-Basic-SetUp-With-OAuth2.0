import { PickType } from '@nestjs/swagger';
import { AccessTokenResponse } from './access-token.response';

export class RefreshTokenResponse extends PickType(AccessTokenResponse, [
  'accessToken',
  'expiresIn',
  'tokenType',
]) {}
