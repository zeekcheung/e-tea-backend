import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { jwtExpiresIn } from './auth.module';
import { LoginDto } from './dto/login.dto';
import { AccessTokenPayload, AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ role, phone, password }: LoginDto): Promise<AuthEntity> {
    // 判断用户是否存在
    const user = await this.prisma.user.findFirst({
      where: { role, phone },
    });
    if (!user) {
      throw new NotFoundException(
        `No user found for role: ${role} and phone: ${phone}`,
      );
    }

    // 判断密码是否正确
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: AccessTokenPayload = {
      userId: user.id,
    };

    // 生成 Token 并返回
    return {
      accessToken: this.jwtService.sign(payload),
      accessTokenExpires: Date.now() + jwtExpiresIn,
    };
  }
}
