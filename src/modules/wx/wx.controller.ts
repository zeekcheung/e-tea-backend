import { Controller, Get, Put } from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorators';
import { Role } from '../../types/common';
import { WxService } from './wx.service';

@Controller('wx')
export class WxController {
  constructor(private readonly wxService: WxService) {}

  @Put('access-token')
  @Auth(Role.Admin)
  async refreshAccessToken() {
    const token = await this.wxService.requestAccessToken();
    this.wxService.setAccessToken(token);
    return token;
  }

  @Get('access-token')
  @Auth(Role.Admin)
  getAccessToken() {
    return this.wxService.getAccessToken();
  }
}
