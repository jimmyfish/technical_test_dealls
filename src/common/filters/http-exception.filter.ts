import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  // HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      status: 'error',
      code: status,
      message:
        exception.message.substring(0, 1) === '['
          ? JSON.parse(exception.message).map(
              (e: { message?: string }) => e.message,
            )
          : exception.message,
    });
  }
}

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter<T> {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;
    response.status(status).json({
      errors: exception.errors,
      message: exception.message,
      e: status,
    });
  }
}
