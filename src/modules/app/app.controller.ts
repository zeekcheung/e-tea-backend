import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Public } from '../../decorators/auth.decorators';
import { FilterKeysInterceptor } from '../../interceptors/filter-keys.interceptor';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class AppController {
  constructor(private readonly appService: AppService) {}
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
