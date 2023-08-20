import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { VerifyProductCategoryGuard } from './verify-product-category.guard';
import { VerifyShopkeeperGuard } from './verify-shopkeeper.guard';
import { VerifyUserGuard } from './verify-user.guard';

@Module({
  imports: [PrismaModule],
  providers: [
    VerifyUserGuard,
    VerifyShopkeeperGuard,
    VerifyProductCategoryGuard,
  ],
  exports: [VerifyUserGuard, VerifyShopkeeperGuard, VerifyProductCategoryGuard],
})
export class GuardsModule {}
