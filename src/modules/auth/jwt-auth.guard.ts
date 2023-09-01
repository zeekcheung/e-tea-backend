import { JWT_ENABLE, JWT_SECRET } from '@/common/constant/config';
import {
  AUTH_KEY,
  IS_PROTECTED_KEY,
  IS_PUBLIC_KEY,
} from '@/common/decorators/auth.decorators';
import { UserService } from '@/modules/user/user.service';
import { Role } from '@/types/model';
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
import { IAccessTokenPayload } from './entities/auth.entity';

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
    // whether jwt enable
    if (!this.configService.get(JWT_ENABLE)) {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    // all users can access
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    if (isPublic) {
      return true;
    }
    // only authenticated users can access
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      IS_PROTECTED_KEY,
      targets,
    );
    let roles = this.reflector.getAllAndOverride<Role[]>(AUTH_KEY, targets);
    if (isProtected) {
      roles = Object.values(Role) as Role[];
    }
    // extract jwt from request
    const extractJwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractJwtFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const secret = this.configService.get<string>(JWT_SECRET);
      const payload = this.jwtService.verify<IAccessTokenPayload>(token, {
        secret,
      });
      // whether user exists
      const user = await this.userService.findUnique({ id: payload.userId });
      if (!user) {
        throw new NotFoundException(`No user found for id: ${payload.userId}`);
      }
      // whether user is authorized
      if (!roles.includes(user.role)) {
        throw new UnauthorizedException(
          `User ${user.id} is not authorized to access this resource`,
        );
      }
      // add user to request context
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
