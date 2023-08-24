import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, QueryInfo, loggingMiddleware } from 'nestjs-prisma';
import configuration from '../../config/configuration';
import { softDeleteMiddleware } from '../../middlewares/soft-delete.middleware';
import { AddressModule } from '../address/address.module';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';
import { OssModule } from '../oss/oss.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductSpecificationModule } from '../product-specification/product-specification.module';
import { ProductModule } from '../product/product.module';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from '../user/user.module';
import { RefreshAccessTokenService } from '../wx/refresh-access-token.service';
import { WxModule } from '../wx/wx.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // global modules
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log', // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
          softDeleteMiddleware({
            targetModels: [
              'User',
              'Shop',
              'Product',
              'ProductCategory',
              'ProductSpecification',
              'Order',
              'Address',
              'CartItem',
            ],
            targetField: 'deletedAt',
          }),
        ],
      },
    }),
    // custom modules
    WxModule,
    OssModule,
    AuthModule,
    UserModule,
    ShopModule,
    ProductModule,
    ProductCategoryModule,
    ProductSpecificationModule,
    AddressModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, RefreshAccessTokenService],
})
export class AppModule {}
