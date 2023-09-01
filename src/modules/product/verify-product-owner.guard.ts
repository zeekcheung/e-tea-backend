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
export class VerifyProductOwnerGuard implements CanActivate {
  constructor() { }

  async canActivate(context: ExecutionContext) {
    // TEST: test product owner guard
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const productId = +params.id;
    const product = await xprisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException(`Product id:${productId} not found`);
    }
    if (!verifyUserOwnership(request.user as User, product.shop.shopKeeperId)) {
      throw new UnauthorizedException('You are not the owner of the shop');
    }
    return true;
  }
}
