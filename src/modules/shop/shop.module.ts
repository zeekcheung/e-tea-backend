import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { VerifyShopkeeperGuard } from './verify-shopkeeper.guard';

// TEST: 测试店铺模块

@Module({
  controllers: [ShopController],
  providers: [ShopService, VerifyShopkeeperGuard],
  exports: [ShopService],
})
export class ShopModule { }
