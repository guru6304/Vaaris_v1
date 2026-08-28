import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { RequestWithId } from '../interfaces/request-with-id.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<RequestWithId>();
    const res = ctx.getResponse<Response>();

    const { method, originalUrl, ip } = req;
    const requestId = req.requestId || 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res.statusCode;

          this.logger.log(
            `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip || 'unknown'}`,
          );
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const statusCode = err?.status || 500;

          this.logger.warn(
            `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - Error: ${err?.message || 'Unknown'}`,
          );
        },
      }),
    );
  }
}
