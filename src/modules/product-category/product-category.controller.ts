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
import { VerifyProductCategoryGuard } from '../guards/verify-product-category.guard';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryService } from './product-category.service';

@Controller('product-category')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @Auth(Role.SHOPKEEPER)
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
