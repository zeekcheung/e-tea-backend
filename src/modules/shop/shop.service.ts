import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateShopDto, createShopData } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  create(createShopDto: CreateShopDto) {
    return this.prisma.shop.create({
      data: createShopData(createShopDto),
    });
  }

  findAll() {
    return this.prisma.shop.findMany();
  }

  findOne(id: number) {
    return this.prisma.shop.findUnique({ where: { id } });
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return this.prisma.shop.update({ where: { id }, data: updateShopDto });
  }

  remove(id: number) {
    return this.prisma.shop.delete({ where: { id } });
  }
}
