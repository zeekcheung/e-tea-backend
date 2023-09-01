import { Module } from '@nestjs/common';
import { ProductSpecificationController } from './product-specification.controller';
import { ProductSpecificationService } from './product-specification.service';
import { VerifyProductSpecificationGuard } from './verify-product-specification.guard';

// TEST: test product specification module

@Module({
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService, VerifyProductSpecificationGuard],
  exports: [ProductSpecificationService],
})
export class ProductSpecificationModule { }
