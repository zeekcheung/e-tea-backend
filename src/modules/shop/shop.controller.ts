import { Auth, Public } from '@/common/decorators/auth.decorators';
import { FilterKeysInterceptor } from '@/common/interceptors/filter-keys.interceptor';
import { Role } from '@/types/model';
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
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopService } from './shop.service';
import { VerifyShopkeeperGuard } from './verify-shopkeeper.guard';

@Controller('shop')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get()
  @Public()
  findAll() {
    // TODO: 模糊查询店铺
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
