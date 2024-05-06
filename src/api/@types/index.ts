import { HttpStatus } from '@nestjs/common';
import { UserRole } from '../user/enums/user-designation.enum';

export type UserRequestType = {
  email: string;
  userId: string;
  id: string;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
  role: UserRole[];
};

//Inorder to use custom request data i.e @ExtractKeyFromRequest
declare module 'express' {
  export interface Request {
    user: UserRequestType;
  }
}

export type PayloadType = {
  email: string;
  userId: string;
  authId: string;
  role: UserRole[];
};
export type SuccessResponseType<T> = {
  statusCode: HttpStatus;
  message: string;
  result: T;
  resultInfo?: {
    perPage: number;
    page: number;
  };
};

export type PaginatedSuccessResponseType<T> = SuccessResponseType<T> & {
  resultInfo?: {
    perPage: number;
    page: number;
  };
};
