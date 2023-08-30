import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { VerifyUserGuard } from './verify-user.guard';

// TEST: 测试用户模块

@Module({
  controllers: [UserController],
  providers: [UserService, VerifyUserGuard],
  exports: [UserService],
})
export class UserModule { }
