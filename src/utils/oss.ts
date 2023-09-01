import crypto from 'crypto-js';
import type {
  IOssHelper,
  OssOptions,
  Policy,
  Signature,
  UploadParams,
} from '../types/oss';

export default class MpUploadOssHelper implements IOssHelper {
  accessKeyId: string;
  accessKeySecret: string;
  timeout: number;
  maxSize: number;

  constructor(options: OssOptions) {
    this.accessKeyId = options.accessKeyId;
    this.accessKeySecret = options.accessKeySecret;
    this.timeout = options.timeout || 1;
    this.maxSize = options.maxSize || 1024 * 1024;
  }

  createUploadParams(): UploadParams {
    const policy = this.getPolicyBase64();
    const signature = this.getSignature(policy);

    return {
      OSSAccessKeyId: this.accessKeyId,
      policy,
      signature,
    };
  }

  getPolicyBase64(): Policy {
    const date = new Date();
    // set policy expiration
    date.setHours(date.getHours() + this.timeout);
    const srcT = date.toISOString();
    const policyText = {
      expiration: srcT,
      conditions: [
        // limit file size
        ['content-length-range', 0, this.maxSize * 1024 * 1024],
      ],
    };
    const buffer = Buffer.from(JSON.stringify(policyText));
    return buffer.toString('base64');
  }

  getSignature(policy: Policy): Signature {
    return crypto.enc.Base64.stringify(
      crypto.HmacSHA1(policy, this.accessKeySecret),
    );
  }
}
