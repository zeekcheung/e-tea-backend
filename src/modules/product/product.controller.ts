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
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll() {
    // TODO: 模糊查询商品
    return this.productService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.SHOPKEEPER)
  // WARNING: @UseGuards(VerifyProductOwnerGuard) is not working
  // @UseGuards(VerifyProductOwnerGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(Role.SHOPKEEPER)
  // WARNING: @UseGuards(VerifyProductOwnerGuard) is not working
  // @UseGuards(VerifyProductOwnerGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
