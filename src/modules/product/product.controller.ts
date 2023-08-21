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
import { Auth, Public } from '../../decorators/auth.decorators';
import { FilterKeysInterceptor } from '../../interceptors/filter-keys.interceptor';
import { Role } from '../../types/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Auth(Role.Shopkeeper)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.Shopkeeper)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    // TODO: 完善更新库存和商品状态的逻辑
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(Role.Shopkeeper)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
