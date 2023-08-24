import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'nestjs-prisma';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/configuration';
import { UserModule } from '../user/user.module';
import { WxService } from '../wx/wx.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get(JWT_SECRET);
        const expiresIn = configService.get(JWT_EXPIRES_IN);

        return {
          secret,
          signOptions: { expiresIn }, // e.g. 30s, 7d, 24h
        };
      },
    }),
    UserModule,
    WxService,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // register the JwtAuthGuard as a global guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
