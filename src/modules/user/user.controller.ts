import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VerifyUserGuard } from './verify-user.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { FilterKeysInterceptor } from '@/common/interceptors/filter-keys.interceptor';
import { Protected, Public } from '@/common/decorators/auth.decorators';

@Controller('user')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Protected()
  async findAll() {
    // TODO:模糊查询
    return await this.userService.findAll();
  }

  @Get(':id')
  @Protected()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUnique(id);
  }

  @Patch(':id')
  @Protected()
  @UseGuards(VerifyUserGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Protected()
  @UseGuards(VerifyUserGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
