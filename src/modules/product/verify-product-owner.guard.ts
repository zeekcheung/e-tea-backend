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
export class VerifyProductOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext) {
    // TEST: 判断用户是否是店长
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const productId = +params.id;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }
    if (!verifyUserOwnership(request.user as User, product.shop.shopKeeperId)) {
      throw new UnauthorizedException('You are not the owner of the shop');
    }
    return true;
  }
}
