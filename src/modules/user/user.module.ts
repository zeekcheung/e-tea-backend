import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { GuardsModule } from '../guards/guards.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, GuardsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
