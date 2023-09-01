import { xprisma } from '@/common/prisma/client';
import { verifyUserOwnership } from '@/utils/auth';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class VerifyShopkeeperGuard implements CanActivate {
  constructor() { }

  async canActivate(context: ExecutionContext) {
    // TEST: test shopkeeper guard
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const shopId = +params.id;
    const shop = await xprisma.shop.findUnique({ where: { id: shopId } });

    if (!shop) {
      throw new NotFoundException(`Shop id:${shopId} not found`);
    }
    if (!verifyUserOwnership(request.user as User, shop.shopKeeperId)) {
      throw new UnauthorizedException('You are not the owner of the shop');
    }
    return true;
  }
}
