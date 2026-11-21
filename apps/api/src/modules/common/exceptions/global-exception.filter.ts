import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    // Exceptions NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const errorResponse = exception.getResponse();

      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : ((errorResponse as { message?: string | string[] }).message ??
            exception.message);

      // Exceptions TypeORM
    } else if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as {
        code?: string;
        constraint?: string;
      };

      switch (driverError.code) {
        case '23505': // Unique violation
          status = HttpStatus.CONFLICT;
          message = 'Resource already exists';
          break;

        case '23503': // Foreign key violation
          status = HttpStatus.CONFLICT;
          message = 'Foreign key constraint violation';
          break;

        case '23502': // Not null violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Not null constraint violation';
          break;

        case '23514': // Check violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Check constraint violation';
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Internal server error';
          break;
      }
    }

    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
