import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, QueryInfo, loggingMiddleware } from 'nestjs-prisma';
import { softDeleteMiddleware } from '../../middlewares/soft-delete.middleware';
import { AuthModule } from '../auth/auth.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductModule } from '../product/product.module';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
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
            targetModels: ['User'],
            targetField: 'deletedAt',
          }),
        ],
      },
    }),

    AuthModule,
    UserModule,
    ShopModule,
    ProductModule,
    ProductCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
