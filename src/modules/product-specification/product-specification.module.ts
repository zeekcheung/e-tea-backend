import { Module } from '@nestjs/common';
import { ProductSpecificationController } from './product-specification.controller';
import { ProductSpecificationService } from './product-specification.service';

@Module({
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService],
})
export class ProductSpecificationModule {}
