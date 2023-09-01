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
export class VerifyProductCategoryGuard implements CanActivate {
  constructor() { }

  async canActivate(context: ExecutionContext) {
    // TEST: test product category guard
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const productCategoryId = +params.id;

    const { shop } = await xprisma.productCategory.findFirst({
      where: { id: productCategoryId },
      include: {
        shop: true,
      },
    });
    if (!shop) {
      throw new NotFoundException(`Shop id:${shop.id} not found`);
    }
    if (!verifyUserOwnership(request.user as User, shop.shopKeeperId)) {
      throw new UnauthorizedException('You are not the owner of the shop');
    }
    return true;
  }
}
