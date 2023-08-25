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
import { Auth, Public } from '../../decorators/auth.decorators';
import { FilterKeysInterceptor } from '../../interceptors/filter-keys.interceptor';
import { Role } from '../../types/common';
import { VerifyShopkeeperGuard } from '../guards/verify-shopkeeper.guard';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopService } from './shop.service';

@Controller('shop')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.shopService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyShopkeeperGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopService.update(id, updateShopDto);
  }

  @Delete(':id')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyShopkeeperGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.remove(id);
  }
}
