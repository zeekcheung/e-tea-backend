import {
  OSS_ACCESS_KEY_ID,
  OSS_ACCESS_KEY_SECRET,
  OSS_MAX_SIZE,
  OSS_TIMEOUT,
} from '@/common/constant/config';
import { IUploadParams } from '@/types/oss';
import MpUploadOssHelper from '@/utils/oss';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OssService {
  private ossHelper: MpUploadOssHelper;

  constructor(private readonly configService: ConfigService) {
    this.ossHelper = new MpUploadOssHelper({
      accessKeyId: this.configService.get(OSS_ACCESS_KEY_ID),
      accessKeySecret: this.configService.get(OSS_ACCESS_KEY_SECRET),
      timeout: this.configService.get(OSS_TIMEOUT),
      maxSize: this.configService.get(OSS_MAX_SIZE),
    });
  }

  createUploadParams(): IUploadParams {
    return this.ossHelper.createUploadParams();
  }
}
