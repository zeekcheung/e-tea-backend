import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { catchError, firstValueFrom } from 'rxjs';
import { JWT_EXPIRES_IN } from '../../config/configuration';
import {
  WxGetAccessTokenParams,
  WxGetAccessTokenResponseBoxy,
  WxGetPhoneNumberParams,
  WxGetPhoneNumberResponseBoxy,
  WxLoginParams,
  WxLoginResponseBoxy,
} from '../../types/auth';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenPayload, AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login({
    role,
    appId,
    appSecret,
    loginCode,
    getPhoneNumberCode,
  }: LoginDto): Promise<AuthEntity> {
    // 微信登录
    const { openid, session_key } = await this.wxLogin({
      appId,
      appSecret,
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
      // 获取用户手机号
      const { access_token } = await this.wxGetAccessToken({
        appId,
        appSecret,
      });
      const { phone_info } = await this.wxGetPhoneNumber({
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

    const payload: AccessTokenPayload = { userId: user.id };
    const jwtExpiresIn = this.configService.get(JWT_EXPIRES_IN);

    // 生成 Token 并返回
    return {
      accessToken: this.jwtService.sign(payload),
      accessTokenExpires: Date.now() + ms(jwtExpiresIn),
    };
  }

  private async wxLogin({
    appId,
    appSecret,
    code,
  }: WxLoginParams): Promise<WxLoginResponseBoxy> {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
    const { data } = await firstValueFrom(
      this.httpService.get<WxLoginResponseBoxy>(url).pipe(
        catchError((error: any) => {
          throw new BadRequestException(error.response.data);
        }),
      ),
    );
    const { errcode, errmsg } = data;
    if (errcode !== 0) {
      throw new BadRequestException(errmsg);
    }
    return data;
  }

  private async wxGetPhoneNumber({
    accessToken,
    code,
  }: WxGetPhoneNumberParams) {
    const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
    const reqData = { code };

    const { data } = await firstValueFrom(
      this.httpService.post<WxGetPhoneNumberResponseBoxy>(url, reqData).pipe(
        catchError((error: any) => {
          throw new BadRequestException(error.response.data);
        }),
      ),
    );
    const { errcode, errmsg } = data;
    if (errcode == -1 || errcode == 40029) {
      throw new BadRequestException(errmsg);
    }
    return data;
  }

  private async wxGetAccessToken({ appId, appSecret }: WxGetAccessTokenParams) {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    const { data } = await firstValueFrom(
      this.httpService.get<WxGetAccessTokenResponseBoxy>(url).pipe(
        catchError((error: any) => {
          throw new BadRequestException(error.response.data);
        }),
      ),
    );
    return data;
  }
}
