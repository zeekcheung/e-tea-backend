import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loggingMiddleware, PrismaModule, QueryInfo } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '@/common/config/configuration';
import { softDeleteMiddleware } from '@/common/middlewares/soft-delete.middleware';
import { WxModule } from '@/modules/wx/wx.module';
import { OssModule } from '@/modules/oss/oss.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { ShopModule } from '@/modules/shop/shop.module';
import { ProductModule } from '@/modules/product/product.module';
import { ProductCategoryModule } from '@/modules/product-category/product-category.module';
import { ProductSpecificationModule } from '@/modules/product-specification/product-specification.module';
import { RefreshAccessTokenService } from '@/modules/wx/refresh-access-token.service';

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
        prismaOptions: {
          log: ['info', 'warn', 'error'],
          errorFormat: 'pretty',
        },
        middlewares: [
          // loggingMiddleware({
          //   logger: new Logger('PrismaMiddleware'),
          //   logLevel: 'log', // default is `debug`
          //   logMessage: (query: QueryInfo) =>
          //     `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          // }),
          softDeleteMiddleware({
            targetModels: [
              'User',
              'Shop',
              'Product',
              'ProductCategory',
              'ProductSpecification',
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
  ],
  controllers: [AppController],
  providers: [AppService, RefreshAccessTokenService],
})
export class AppModule { }
