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

export class ErrorResponse {
  @ApiProperty({
    description: 'Status Code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error description',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Current date time',
    example: '2023-03-13T04:26:36.916Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'API path that is giving error',
    example: '/v1/api/token/',
  })
  path: string;

  @ApiProperty({
    description: 'All errors',
    isArray: true,
    type: CustomError,
    example: [
      {
        message: 'Grant type is not valid',
        errorCode: 'VALIDATION.TOKEN.GRANT_TYPE.INVALID',
      },
    ],
  })
  errors: CustomError[];
}

export class GetFeelingErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'Status Code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error description',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: '',
    example: [
      {
        message: 'Page number must be a valid integer zero or greater.',
        errorCode: 'VALIDATION.PAGINATION.PAGE_NUMBER.INVALID',
      },
    ],
  })
  errors: CustomError[];
}

export class FeelingsNotFoundErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'Status Code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error description',
    example: 'Not Found',
  })
  message: string;

  @ApiProperty({
    description: 'Feelings not found error',
    example: [
      {
        message: 'No recorded feelings found',
        errorCode: 'FEELINGS.NOT_FOUND',
      },
    ],
  })
  errors: CustomError[];
}

export class UnauthorizedErrorResponse extends ErrorResponse {
  @ApiProperty({
    description: 'Status Code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error description',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'Unauthorized error',
    example: [
      {
        message: 'Unauthorized access to a restricted area!',
        errorCode: 'XHR_ERROR.401',
      },
    ],
  })
  errors: CustomError[];
}
