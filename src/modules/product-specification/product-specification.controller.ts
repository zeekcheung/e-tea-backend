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
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { ProductSpecificationService } from './product-specification.service';
import { VerifyProductSpecificationGuard } from './verify-product-specification.guard';

@Controller('product-specification')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) { }

  @Post()
  @Auth(Role.SHOPKEEPER)
  create(@Body() createProductSpecificationDto: CreateProductSpecificationDto) {
    return this.productSpecificationService.create(
      createProductSpecificationDto,
    );
  }

  @Get()
  @Public()
  findAll() {
    // TODO: 模糊查询商品规格
    return this.productSpecificationService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productSpecificationService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyProductSpecificationGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductSpecificationDto: UpdateProductSpecificationDto,
  ) {
    return this.productSpecificationService.update(
      id,
      updateProductSpecificationDto,
    );
  }

  @Delete(':id')
  @Auth(Role.SHOPKEEPER)
  @UseGuards(VerifyProductSpecificationGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productSpecificationService.remove(id);
  }
}
