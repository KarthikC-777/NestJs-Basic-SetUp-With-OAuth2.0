import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({
    description: 'Status Code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Success message',
  })
  message: string;
}
