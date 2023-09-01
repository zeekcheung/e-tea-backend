import { Auth, Public } from '@/common/decorators/auth.decorators';
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
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { FindAllShopsDto } from './dto/find-all-shops.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopService } from './shop.service';
import { VerifyShopkeeperGuard } from './verify-shopkeeper.guard';
import { FindOneShopDto } from './dto/find-one-shop.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get()
  @Public()
  findAll(@Body() findAllShopsDto: FindAllShopsDto) {
    return this.shopService.findAll(findAllShopsDto);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() findOneShopDto: FindOneShopDto,
  ) {
    return this.shopService.findOne(id, findOneShopDto);
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
