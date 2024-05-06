import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsNotEmpty } from 'class-validator';

export class RefreshDTO {
  @IsNotEmpty({ message: 'VALIDATION.TOKEN.EMPTY' })
  @ApiProperty({
    description: 'Refresh token that is returned when user logs in',
    required: true,
  })
  refreshToken: string;

  @IsNotEmpty({ message: 'VALIDATION.TOKEN.GRANT_TYPE.EMPTY' })
  @Contains('refresh_token', { message: 'VALIDATION.TOKEN.GRANT_TYPE.INVALID' })
  @ApiProperty({
    description: 'Grant type of the token',
    required: true,
    default: 'refresh_token',
  })
  grantType: string;
}
