import { Module } from '@nestjs/common';
import { ProductSpecificationController } from './product-specification.controller';
import { ProductSpecificationService } from './product-specification.service';
import { VerifyProductSpecificationGuard } from './verify-product-specification.guard';

// TEST: 测试商品规格模块

@Module({
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService, VerifyProductSpecificationGuard],
  exports: [ProductSpecificationService],
})
export class ProductSpecificationModule { }
