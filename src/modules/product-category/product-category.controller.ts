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
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { FindAllProductCategoriesDto } from './dto/find-all-product-categories.dto';
import { FindOneProductCategoryDto } from './dto/find-one-product-category.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryService } from './product-category.service';
import { VerifyProductCategoryGuard } from './verify-product-category.guard';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) { }

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get()
  @Public()
  findAll(@Body() findAllProductCategoriesDto: FindAllProductCategoriesDto) {
    return this.productCategoryService.findAll(findAllProductCategoriesDto);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() findOneProductCategoryDto: FindOneProductCategoryDto,
  ) {
    return this.productCategoryService.findOne(id, findOneProductCategoryDto);
  }

  @Patch(':id')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyProductCategoryGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyProductCategoryGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoryService.remove(id);
  }

  @Patch('reorder')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyProductCategoryGuard)
  reorder(@Body() reorderProductCategoryDto: ReorderProductCategoryDto) {
    return this.productCategoryService.reorder(reorderProductCategoryDto);
  }
}
