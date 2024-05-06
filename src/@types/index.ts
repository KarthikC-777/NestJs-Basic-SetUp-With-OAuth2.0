import { HttpStatus } from '@nestjs/common';

export type SuccessResponseType<T> = {
  statusCode: HttpStatus;
  message: string;
  result: T;
};

export type ErrorResponseType<T> = Omit<SuccessResponseType<null>, 'result'> & {
  errors: null | unknown;
  path: string;
  timestamp: string;
} & T extends true
  ? {
      errorInfo: null | unknown;
    }
  : Record<string, unknown>;

export type TLSOptionsType = {
  host: string;
  port: number;
  password: string;
};

export type RedisConnectionType = {
  host: string;
  port: number;
  password: string;
  tls?: TLSOptionsType;
};
