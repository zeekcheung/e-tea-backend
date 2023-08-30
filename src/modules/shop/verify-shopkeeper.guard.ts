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
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class VerifyShopkeeperGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext) {
    // TEST: 判断用户是否是店长
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const shopId = +params.id;
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });

    if (!shop) {
      throw new NotFoundException(`Shop ${shopId} not found`);
    }
    if (!verifyUserOwnership(request.user as User, shop.shopKeeperId)) {
      throw new UnauthorizedException('You are not the owner of the shop');
    }
    return true;
  }
}
