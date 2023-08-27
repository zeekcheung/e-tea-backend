import { Module } from '@nestjs/common';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

// TODO: review product module

@Module({
  imports: [ProductCategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
