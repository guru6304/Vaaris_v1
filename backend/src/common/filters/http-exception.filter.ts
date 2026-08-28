import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestWithId } from '../interfaces/request-with-id.interface';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();

    const requestId = request.requestId || 'unknown-req-id';
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected internal error occurred. Please try again later.';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        errorCode = this.statusToErrorCode(status);
      } else if (typeof res === 'object' && res !== null) {
        const responseObj = res as Record<string, any>;
        message = responseObj.message || exception.message;
        errorCode = responseObj.error || this.statusToErrorCode(status);

        // Class-validator validation errors array handling
        if (Array.isArray(responseObj.message)) {
          errorCode = 'VALIDATION_FAILED';
          message = 'Request validation failed';
          details = responseObj.message.map((msg: string) => ({
            message: msg,
          }));
        } else if (responseObj.details) {
          details = responseObj.details;
        }
      }
    } else if (exception instanceof Error) {
      // Internal system error or Prisma error
      const errName = exception.name || '';
      const errMsg = exception.message || '';

      if (errName.includes('Prisma') || errMsg.includes('prisma') || errMsg.includes('database')) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        errorCode = 'DATABASE_ERROR';
        message = 'Database service is currently unavailable or encountered an error.';
        // Mask internal database details from client
        this.logger.error(`[${requestId}] Database/Prisma Exception: ${exception.message}`, exception.stack);
      } else {
        this.logger.error(`[${requestId}] Unhandled Exception: ${exception.message}`, exception.stack);
      }
    } else {
      this.logger.error(`[${requestId}] Unknown Exception: ${JSON.stringify(exception)}`);
    }

    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: typeof errorCode === 'string' ? errorCode.toUpperCase().replace(/\s+/g, '_') : 'ERROR',
        message: typeof message === 'string' ? message : 'An error occurred',
        ...(details ? { details } : {}),
      },
      meta: {
        requestId,
        timestamp,
      },
    };

    response.status(status).json(errorBody);
  }

  private statusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
