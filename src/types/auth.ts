import { LoginDto } from '../modules/auth/dto/login.dto';

export type WxLoginParams = Pick<LoginDto, 'appId' | 'appSecret'> & {
  code: string;
};

export interface WxLoginResponseBoxy {
  openid: string;
  session_key: string;
  unionid: string;
  errcode: -1 | 0 | 40029 | 45011 | 40226;
  errmsg: string;
}

export interface WxGetPhoneNumberParams {
  accessToken: string;
  code: string;
}

export interface WxGetPhoneNumberResponseBoxy {
  errcode: -1 | 40029;
  errmsg: string;
  phone_info: {
    phoneNumber: string;
    purePhoneNumber: string;
    countryCode: string;
    watermark: {
      timestamp: string;
      appid: string;
    };
  };
}

export type WxGetAccessTokenParams = Pick<WxLoginParams, 'appId' | 'appSecret'>;

export interface WxGetAccessTokenResponseBoxy {
  access_token: string;
  expires_in: number;
}
