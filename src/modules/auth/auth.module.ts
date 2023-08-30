import { JWT_EXPIRES_IN, JWT_SECRET } from '@/common/constant/config';
import { UserModule } from '@/modules/user/user.module';
import { WxModule } from '@/modules/wx/wx.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get(JWT_SECRET);
        const expiresIn = configService.get(JWT_EXPIRES_IN);

        return {
          secret,
          signOptions: { expiresIn }, // e.g. 30s, 7d, 24h
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    WxModule,
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
export class AuthModule { }
