import { Module } from '@nestjs/common';
import { ProductSpecificationController } from './product-specification.controller';
import { ProductSpecificationService } from './product-specification.service';

// TODO: review product specification module

@Module({
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService],
})
export class ProductSpecificationModule {}
