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
import { Auth, Public } from '../../decorators/auth.decorators';
import { Role } from '../../types/common';
import { VerifyProductCategoryGuard } from '../guards/verify-product-category.guard';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryService } from './product-category.service';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @Auth(Role.Shopkeeper)
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.productCategoryService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoryService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.Shopkeeper)
  @UseGuards(VerifyProductCategoryGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @Auth(Role.Shopkeeper)
  @UseGuards(VerifyProductCategoryGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoryService.remove(id);
  }

  @Patch('reorder')
  @Auth(Role.Shopkeeper)
  @UseGuards(VerifyProductCategoryGuard)
  reorder(@Body() reorderProductCategoryDto: ReorderProductCategoryDto) {
    return this.productCategoryService.reorder(reorderProductCategoryDto);
  }
}
