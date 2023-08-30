import { verifyUserOwnership } from '@/utils/auth';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class VerifyUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TEST: 验证用户是否账户本人
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const userId = +params.id;

    if (!verifyUserOwnership(request.user as User, userId)) {
      throw new UnauthorizedException('You are not the owner of the account');
    }
    return true;
  }
}
