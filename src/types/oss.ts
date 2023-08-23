export interface IOssOptions {
  /** 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户并授权 */
  accessKeyId: string;
  accessKeySecret: string;
  /** 限制参数的生效时间，单位为小时，默认值为1 */
  timeout: number;
  /** 限制上传文件大小，单位为MB，默认值为10 */
  maxSize: number;
}

export type Policy = string;
export type Signature = string;

export interface IUploadParams {
  OSSAccessKeyId: string;
  policy: Policy;
  signature: Signature;
}

export interface IOssHelper extends IOssOptions {
  createUploadParams(): IUploadParams;
  getPolicyBase64(): Policy;
  getSignature(policy: Policy): Signature;
}
