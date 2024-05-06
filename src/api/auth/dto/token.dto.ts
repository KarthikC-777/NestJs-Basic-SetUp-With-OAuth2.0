import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IsCodeAndTheoryDomain } from '../../../decorators/valid-email-domain.decorator';

enum GrantType {
  client_credentials = 'client_credentials',
  refresh_token = 'refresh_token',
}

export class TokenDTO {
  @ValidateIf((o: TokenDTO) => o.grantType === 'refresh_token')
  @IsNotEmpty({ message: 'VALIDATION.TOKEN.EMPTY' })
  @ApiProperty({
    description: 'Refresh token that is returned when user logs in',
    required: false,
  })
  refreshToken: string;

  @ValidateIf((o: TokenDTO) => o.grantType === 'client_credentials')
  @IsCodeAndTheoryDomain({ message: 'VALIDATION.EMAIL.DOMAIN_NAME.INVALID' })
  @IsString({ message: 'email should be string value' })
  @IsNotEmpty({ message: 'Email cant not be empty' })
  readonly email: string;

  @IsNotEmpty({ message: 'VALIDATION.TOKEN.GRANT_TYPE.EMPTY' })
  @IsEnum(['client_credentials', 'refresh_token'], {
    message: 'VALIDATION.TOKEN.GRANT_TYPE.INVALID',
  })
  @ApiProperty({
    description: 'Grant type of the token',
    required: true,
    enum: GrantType,
    enumName: 'GrantType',
  })
  grantType: string;
}
