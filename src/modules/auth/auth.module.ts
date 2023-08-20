import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

// use OpenSSL to generate a private key:
// openssl rand -base64 32
export const jwtSecret = 'zjP9h6ZI5LoSKCRj';
export const jwtExpiresIn = 24 * 60 * 60 * 1000;

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: jwtExpiresIn }, // e.g. 30s, 7d, 24h
    }),
    UserModule,
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
