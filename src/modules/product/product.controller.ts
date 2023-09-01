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
import { CreateProductDto } from './dto/create-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { FindOneProductDto } from './dto/find-one-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { VerifyProductOwnerGuard } from './verify-product-owner.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll(@Body() findAllProductsDto: FindAllProductsDto) {
    return this.productService.findAll(findAllProductsDto);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() findOneProductDto: FindOneProductDto,
  ) {
    return this.productService.findOne(id, findOneProductDto);
  }

  @Patch(':id')
  @Auth(Role.SHOPKEEPER)
  // @UseGuards(VerifyProductOwnerGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(Role.SHOPKEEPER)
  // @UseGuards(VerifyProductOwnerGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
