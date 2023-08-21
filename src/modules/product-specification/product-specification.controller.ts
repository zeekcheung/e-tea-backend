import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Auth, Public } from '../../decorators/auth.decorators';
import { FilterKeysInterceptor } from '../../interceptors/filter-keys.interceptor';
import { Role } from '../../types/common';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { ProductSpecificationService } from './product-specification.service';

@Controller('product-specification')
@UseInterceptors(FilterKeysInterceptor('password', 'deletedAt'))
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  @Post()
  @Auth(Role.Shopkeeper)
  create(@Body() createProductSpecificationDto: CreateProductSpecificationDto) {
    return this.productSpecificationService.create(
      createProductSpecificationDto,
    );
  }

  @Get()
  @Public()
  findAll() {
    return this.productSpecificationService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productSpecificationService.findOne(+id);
  }

  @Patch(':id')
  @Auth(Role.Shopkeeper)
  update(
    @Param('id') id: string,
    @Body() updateProductSpecificationDto: UpdateProductSpecificationDto,
  ) {
    return this.productSpecificationService.update(
      +id,
      updateProductSpecificationDto,
    );
  }

  @Delete(':id')
  @Auth(Role.Shopkeeper)
  remove(@Param('id') id: string) {
    return this.productSpecificationService.remove(+id);
  }
}
