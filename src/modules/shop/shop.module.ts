import { Module } from '@nestjs/common';
import { GuardsModule } from '../guards/guards.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

// TODO: review shop module

@Module({
  imports: [GuardsModule],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
