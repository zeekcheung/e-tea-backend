import { Protected, Public } from '@/common/decorators/auth.decorators';
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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { VerifyUserGuard } from './verify-user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Protected()
  async findAll(@Body() findAllUsersDto: FindAllUsersDto) {
    return await this.userService.findAll(findAllUsersDto);
  }

  @Get(':id')
  @Protected()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() findOneUserDto: FindOneUserDto,
  ) {
    return await this.userService.findUnique(id, findOneUserDto);
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
