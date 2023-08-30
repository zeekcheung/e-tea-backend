import { __DEV__ } from '@/common/constant/env';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { WxService } from './wx.service';

@Injectable()
export class RefreshAccessTokenService implements OnModuleInit {
  constructor(private readonly wxService: WxService) { }

  /**
   * 定时刷新小程序的 access_token
   */
  async onModuleInit() {
    if (__DEV__) {
      return;
    }
    let { expires_in } = await this.refreshAccessToken();
    setInterval(async () => {
      const token = await this.refreshAccessToken();
      expires_in = token.expires_in;
    }, expires_in * 1000);
  }

  /**
   * 刷新小程序的 access_token
   */
  private async refreshAccessToken() {
    const token = await this.wxService.requestAccessToken();
    this.wxService.setAccessToken(token);
    return token;
  }
}
