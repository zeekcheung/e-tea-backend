import { Controller, Get } from '@nestjs/common';
import { OssService } from './oss.service';
import { Public } from '@/common/decorators/auth.decorators';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) { }

  @Get('post-object-params')
  @Public()
  getPostObjectParams() {
    return this.ossService.createUploadParams();
  }
}
