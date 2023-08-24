import { Injectable, OnModuleInit } from '@nestjs/common';
import { WxService } from './wx.service';

@Injectable()
export class RefreshAccessTokenService implements OnModuleInit {
  constructor(private readonly wxService: WxService) {}

  /**
   * 定时刷新小程序的 access_token
   */
  onModuleInit() {
    let { expires_in } = this.refreshAccessToken();
    setInterval(() => {
      const token = this.refreshAccessToken();
      expires_in = token.expires_in;
    }, expires_in * 1000);
  }

  /**
   * 刷新小程序的 access_token
   */
  private refreshAccessToken() {
    const token = this.wxService.getAccessToken();
    this.wxService.setAccessToken(token);
    return token;
  }
}
