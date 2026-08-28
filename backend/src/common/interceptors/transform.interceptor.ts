import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestWithId } from '../interfaces/request-with-id.interface';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const requestId = request?.requestId || 'unknown-req-id';
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((res) => {
        // If response already matches standard structure, return it
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return {
            ...res,
            meta: {
              requestId,
              timestamp,
              ...(res.meta || {}),
            },
          };
        }

        // Support optional pagination payload if returned as { data: [...], pagination: {...} }
        if (res && typeof res === 'object' && 'pagination' in res && 'data' in res) {
          return {
            success: true,
            data: res.data,
            pagination: res.pagination,
            meta: {
              requestId,
              timestamp,
            },
          };
        }

        return {
          success: true,
          data: res !== undefined ? res : null,
          meta: {
            requestId,
            timestamp,
          },
        };
      }),
    );
  }
}
