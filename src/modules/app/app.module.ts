import configuration from '@/common/config/configuration';
import { AuthModule } from '@/modules/auth/auth.module';
import { OssModule } from '@/modules/oss/oss.module';
import { ProductCategoryModule } from '@/modules/product-category/product-category.module';
import { ProductSpecificationModule } from '@/modules/product-specification/product-specification.module';
import { ProductModule } from '@/modules/product/product.module';
import { ShopModule } from '@/modules/shop/shop.module';
import { UserModule } from '@/modules/user/user.module';
import { RefreshAccessTokenService } from '@/modules/wx/refresh-access-token.service';
import { WxModule } from '@/modules/wx/wx.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // global modules
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
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
