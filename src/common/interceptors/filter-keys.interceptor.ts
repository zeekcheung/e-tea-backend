import { omitKeysFromObject } from '@/utils/base';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
class FilterInterceptor implements NestInterceptor {
  private targetKeys: string[];

  constructor(...targetKeys: string[]) {
    this.targetKeys = targetKeys;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        // save transformed response to the context
        const res = context.switchToHttp().getResponse<Response>();
        res.locals.transformedResponse = omitKeysFromObject(
          data,
          this.targetKeys,
        );
        // LoggingHttpMiddleware will retrieve the transformed response
      }),
    );
  }
}

export const FilterKeysInterceptor = (...targetKeys: string[]) =>
  new FilterInterceptor(...targetKeys);
