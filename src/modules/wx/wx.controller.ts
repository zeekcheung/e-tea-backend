import { Auth } from '@/common/decorators/auth.decorators';
import { Role } from '@/types/model';
import { Controller, Get, Put } from '@nestjs/common';
import { WxService } from './wx.service';

@Controller('wx')
export class WxController {
  constructor(private readonly wxService: WxService) { }

  @Put('access-token')
  @Auth(Role.ADMIN)
  async refreshAccessToken() {
    const token = await this.wxService.requestAccessToken();
    this.wxService.setAccessToken(token);
    return this.wxService.getAccessToken();
  }

  @Get('access-token')
  @Auth(Role.ADMIN)
  getAccessToken() {
    return this.wxService.getAccessToken();
  }
}
