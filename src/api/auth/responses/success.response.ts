import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../../responses/success.response';

export class LogoutSuccessResponse extends SuccessResponse {
  @ApiProperty({
    description: 'Result',
    nullable: true,
    default: null,
  })
  result: unknown;
}
