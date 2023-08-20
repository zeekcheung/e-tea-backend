import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Protected, Public } from '../../decorators/auth.decorators';
import { FilterKeysInterceptor } from '../../interceptors/filter-keys.interceptor';
import { verifyUserOwnership } from '../../utils/auth';
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
    const user = await this.userService.findUnique(id);
    return user;
  }

  @Patch(':id')
  @Protected()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    // 判断用户是否本人或者管理员
    if (!verifyUserOwnership(req.user as User, id)) {
      throw new UnauthorizedException('You are not the owner');
    }
    const user = await this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @Protected()
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    // 判断用户是否本人或者管理员
    if (!verifyUserOwnership(req.user as User, id)) {
      throw new UnauthorizedException('You are not the owner');
    }
    const user = await this.userService.remove(id);
    return user;
  }
}
