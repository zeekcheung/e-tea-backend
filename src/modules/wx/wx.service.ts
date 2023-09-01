import { WX_APP_ID, WX_APP_SECRET } from '@/common/constant/config';
import type {
  WxAppInfo,
  WxGetAccessTokenResponseBoxy,
  WxGetPhoneNumberParams,
  WxGetPhoneNumberResponseBoxy,
  WxLoginParams,
  WxLoginResponseBoxy,
} from '@/types/wx';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WxService {
  /** 小程序 appId */
  private appId: WxAppInfo['appId'];
  /** 小程序 appSecret */
  private appSecret: WxAppInfo['appSecret'];
  /** 小程序全局唯一后台接口调用凭据 */
  private access_token: WxGetAccessTokenResponseBoxy['access_token'];
  /** access_token 的过期时间，单位：秒 */
  private expires_in: WxGetAccessTokenResponseBoxy['expires_in'];

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.appId = configService.get(WX_APP_ID);
    this.appSecret = configService.get(WX_APP_SECRET);
  }

  /**
   * 通过微信小程序的 [code2Session](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html) 接口完成小程序登录流程
   */
  async login({ code }: WxLoginParams): Promise<WxLoginResponseBoxy> {
    const appId = this.appId;
    const appSecret = this.appSecret;
    const grantType = 'authorization_code';
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=${grantType}`;

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

  /**
   * 通过微信小程序的 [getPhoneNumber](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html) 接口获取用户手机号
   */
  async getPhoneNumber({ accessToken, code }: WxGetPhoneNumberParams) {
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

  /**
   * 通过微信小程序的 [getAccessToken](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html) 接口获取小程序全局唯一后台接口调用凭据
   */
  async requestAccessToken() {
    const appId = this.appId;
    const appSecret = this.appSecret;
    const grantType = 'client_credential';

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${grantType}&appid=${appId}&secret=${appSecret}`;

    const { data } = await firstValueFrom(
      this.httpService.get<WxGetAccessTokenResponseBoxy>(url).pipe(
        catchError((error: any) => {
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  /**
   * 设置小程序全局唯一后台接口调用凭据 `access_token`
   */
  setAccessToken({ access_token, expires_in }: WxGetAccessTokenResponseBoxy) {
    // 更新 access_token
    this.access_token = access_token;
    this.expires_in = expires_in;

    return {
      access_token,
      expires_in,
    };
  }

  /**
   *  获取小程序全局唯一后台接口调用凭据 `access_token`
   */
  getAccessToken() {
    return {
      access_token: this.access_token,
      expires_in: this.expires_in,
    };
  }
}
