import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RefreshAccessTokenService } from './refresh-access-token.service';
import { WxController } from './wx.controller';
import { WxService } from './wx.service';

@Module({
  imports: [HttpModule],
  controllers: [WxController],
  providers: [WxService, RefreshAccessTokenService],
  exports: [WxService, RefreshAccessTokenService],
})
export class WxModule {}
