import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Protected, Public } from '../../decorators/auth.decorators';
import { FilterKeysInterceptor } from '../../interceptors/filter-keys.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get()
  @Protected()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  @Protected()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Patch(':id')
  @Protected()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @Protected()
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.remove(id);
    // return UserEntity instead of Prisma.User objects
    return user;
  }
}
