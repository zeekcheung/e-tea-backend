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
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { FindAllProductSpecificationsDto } from './dto/find-all-product-specifications.dto';
import { FindOneProductSpecificationDto } from './dto/find-one-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { ProductSpecificationService } from './product-specification.service';
import { VerifyProductSpecificationGuard } from './verify-product-specification.guard';

@Controller('product-specification')
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
  findAll(
    @Body() findAllProductSpecificationsDto: FindAllProductSpecificationsDto,
  ) {
    return this.productSpecificationService.findAll(
      findAllProductSpecificationsDto,
    );
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() findOneProductSpecificationDto: FindOneProductSpecificationDto,
  ) {
    return this.productSpecificationService.findOne(
      id,
      findOneProductSpecificationDto,
    );
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
