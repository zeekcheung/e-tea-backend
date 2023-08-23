import { Controller, Get } from '@nestjs/common';
import { Public } from '../../decorators/auth.decorators';
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('post-object-params')
  @Public()
  getPostObjectParams() {
    return this.ossService.createUploadParams();
  }
}
