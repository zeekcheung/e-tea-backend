import { JWT_EXPIRES_IN } from '@/common/constant/config';
import { UserService } from '@/modules/user/user.service';
import { WxService } from '@/modules/wx/wx.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { LoginDto } from './dto/login.dto';
import { AuthEntity, IAccessTokenPayload } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly wxService: WxService,
  ) { }

  async login({
    role,
    loginCode,
    getPhoneNumberCode,
  }: LoginDto): Promise<AuthEntity> {
    // 微信登录
    const { openid, session_key } = await this.wxService.login({
      code: loginCode,
    });

    // 用户是否已经注册
    let user = await this.userService.findFirst({
      role,
      openid,
    });

    // 如果已经注册，直接更新 session_key，否则创建用户
    if (user) {
      // 更新 session_key
      user = await this.userService.update(user.id, {
        sessionKey: session_key,
      });
    } else {
      // 获取小程序接口调用凭证
      const { access_token } = this.wxService.getAccessToken();
      // 获取用户手机号
      const { phone_info } = await this.wxService.getPhoneNumber({
        accessToken: access_token,
        code: getPhoneNumberCode,
      });
      const { phoneNumber } = phone_info;
      // 创建用户
      user = await this.userService.create({
        openid,
        sessionKey: session_key,
        role,
        phone: phoneNumber,
      });
    }

    const tokenPayload: IAccessTokenPayload = { userId: user.id };
    const jwtExpiresIn = this.configService.get<string>(JWT_EXPIRES_IN);

    // 生成 Token 并返回
    return {
      accessToken: this.jwtService.sign(tokenPayload),
      accessTokenExpires: Date.now() + ms(jwtExpiresIn),
    };
  }
}
