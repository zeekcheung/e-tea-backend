import {
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { JWT_SECRET_KEY } from '../../config/configuration';
import {
  AUTH_KEY,
  IS_PROTECTED_KEY,
  IS_PUBLIC_KEY,
} from '../../decorators/auth.decorators';
import { Role } from '../../types/common';
import { UserService } from '../user/user.service';
import { AccessTokenPayload } from './entities/auth.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const targets = [context.getHandler(), context.getClass()];
    // 所有用户都可以访问
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    if (isPublic) {
      return true;
    }
    // 只有登录用户才可以访问
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      IS_PROTECTED_KEY,
      targets,
    );
    let roles = this.reflector.getAllAndOverride<Role[]>(AUTH_KEY, targets);
    if (isProtected) {
      roles = Object.values(Role) as Role[];
    }
    // 从请求头中获取 token
    const extractJwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractJwtFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const secret = this.configService.get(JWT_SECRET_KEY);
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret,
      });
      // 判断用户是否存在
      const user = await this.userService.findUnique(payload.userId);
      if (!user) {
        throw new NotFoundException(`No user found for id: ${payload.userId}`);
      }
      // 判断用户是否具有权限
      if (!roles.includes(user.role)) {
        throw new UnauthorizedException(
          `User ${user.id} is not authorized to access this resource`,
        );
      }
      // 绑定用户信息到请求上下文
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
