import { Module } from '@nestjs/common';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { VerifyProductOwnerGuard } from './verify-product-owner.guard';

// TEST: 测试商品模块

@Module({
  imports: [ProductCategoryModule],
  controllers: [ProductController],
  providers: [ProductService, VerifyProductOwnerGuard],
  exports: [ProductService],
})
export class ProductModule { }
