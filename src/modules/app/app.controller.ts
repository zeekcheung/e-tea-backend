import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilterKeysInterceptor } from '@/common/interceptors/filter-keys.interceptor';
import { Public } from '@/common/decorators/auth.decorators';

@Controller()
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('test')
  getTest(): any {
    return 'This is a test case.';
  }
}
