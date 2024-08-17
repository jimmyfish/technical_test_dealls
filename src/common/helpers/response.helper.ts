import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export interface SuccessResponse<T = object | object[]> {
  status: string;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      perPage: number;
      totalPages: number;
      total: number;
    };
  };
}

export interface FailureResponse {
  status: string;
  code: number;
  message: string;
}

export const createSuccessResponse = <T = object | object[]>(
  data: T,
  meta?: {
    pagination?: {
      page: number;
      totalPages: number;
      total: number;
      perPage: number;
    };
  },
): SuccessResponse<T> => {
  return {
    status: 'success',
    data,
    meta,
  };
};

export const createUnauthorizedResponse = (
  message: string,
  code: number,
): FailureResponse => {
  throw new UnauthorizedException({
    status: 'error',
    message,
    code,
  });
};

export const createBadRequestResponse = (returns: {
  code: number;
  message: string;
}): void => {
  const { message, code } = returns;
  throw new BadRequestException({
    status: 'error',
    message,
    code,
  });
};
