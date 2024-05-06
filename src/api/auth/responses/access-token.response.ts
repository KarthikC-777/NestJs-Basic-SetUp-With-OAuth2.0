import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class AccessTokenResponse {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Token type', default: 'Bearer' })
  tokenType: 'Bearer';

  @ApiProperty({ description: 'The expiry time' })
  expiresIn: number;

  @ApiProperty({ description: 'The refresh token' })
  refreshToken: string;

  deleteDate?: Date;

  userId: string;

  sessionId: mongoose.Types.ObjectId;
}
