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
import { verifyUserOwnership } from '../../utils/auth';

@Injectable()
export class VerifyProductCategoryGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    // 判断用户是否本人或者管理员
    const request = context.switchToHttp().getRequest<Request>();
    const params = request.params;
    const productCategoryId = +params.id;
    const { shop } = await this.prisma.productCategory.findFirst({
      where: { id: productCategoryId },
      include: {
        shop: true,
      },
    });
    if (!shop) {
      throw new NotFoundException(`Shop ${shop.id} not found`);
    }
    if (!verifyUserOwnership(request.user as User, shop.shopKeeperId)) {
      throw new UnauthorizedException('You are not the owner of the shop');
    }
    return true;
  }
}
