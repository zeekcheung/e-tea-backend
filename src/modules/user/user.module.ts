import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { VerifyUserGuard } from './verify-user.guard';

// TEST: test user module

@Module({
  controllers: [UserController],
  providers: [UserService, VerifyUserGuard],
  exports: [UserService],
})
export class UserModule { }
