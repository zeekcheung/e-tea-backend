import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { VerifyProductCategoryGuard } from './verify-product-category.guard';

// TEST: 测试商品分类模块

@Module({
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, VerifyProductCategoryGuard],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule { }
