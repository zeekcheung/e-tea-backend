import { omitKeysFromObject } from '@/utils/base';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
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
        // 记录转换后的 response
        const res = context.switchToHttp().getResponse<Response>();
        res.locals.transformedResponse = omitKeysFromObject(
          data,
          this.targetKeys,
        );
      }),
    );
  }
}

export const FilterKeysInterceptor = (...targetKeys: string[]) =>
  new FilterInterceptor(...targetKeys);
