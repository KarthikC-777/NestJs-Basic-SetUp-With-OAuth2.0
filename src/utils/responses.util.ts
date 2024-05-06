import { ApiProperty } from '@nestjs/swagger';

export class CustomError {
  @ApiProperty({
    description: 'Error code',
  })
  errorCode: string;

  @ApiProperty({
    description: 'Error message',
  })
  message: string;
}
