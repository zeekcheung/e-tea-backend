export interface WxAppInfo {
  /** 小程序 appId */
  appId: string;
  /** 小程序 appSecret */
  appSecret: string;
}

export type WxGetAccessTokenParams = WxAppInfo;

export interface WxGetAccessTokenResponseBoxy {
  /** 接口调用凭证，该参数为 URL 参数，非 Body 参数。使用access_token或者authorizer_access_token */
  access_token: string;
  /** 凭证有效时间，单位：秒。目前是 7200 秒之内的值 */
  expires_in: number;
}

export interface WxLoginParams {
  /** 登录时获取的 code */
  code: string;
}

export interface WxLoginResponseBoxy {
  /** 用户唯一标识 */
  openid: string;
  /** 会话密钥 */
  session_key: string;
  /** 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回 */
  unionid: string;
  /** 错误码 */
  errcode: -1 | 0 | 40029 | 45011 | 40226;
  /** 错误信息 */
  errmsg: string;
}

export interface WxGetPhoneNumberParams {
  /** 小程序接口授权凭证 */
  accessToken: string;
  /** 手机号获取凭证 */
  code: string;
}

export interface WxGetPhoneNumberResponseBoxy {
  /** 错误码 */
  errcode: -1 | 40029;
  /** 错误信息 */
  errmsg: string;
  /** 用户手机号信息 */
  phone_info: {
    /** 用户绑定的手机号（国外手机号会有区号） */
    phoneNumber: string;
    /** 没有区号的手机号 */
    purePhoneNumber: string;
    /** 区号 */
    countryCode: string;
    /** 数据水印 */
    watermark: {
      /** 用户获取手机号操作的时间戳 */
      timestamp: string;
      /** 小程序 appid */
      appid: string;
    };
  };
}
