import { xprisma } from '@/common/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateShopData, CreateShopDto } from './dto/create-shop.dto';
import { FindAllShopsDto } from './dto/find-all-shops.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { FindOneShopDto } from './dto/find-one-shop.dto';

@Injectable()
export class ShopService {
  constructor() { }

  create(createShopDto: CreateShopDto) {
    return xprisma.shop.create({
      data: CreateShopData(createShopDto),
    });
  }

  findAll(findAllShopsDto: FindAllShopsDto = {}) {
    const { keyword = '', include = [] } = findAllShopsDto;

    // fuzzy search shops and include relationships
    return xprisma.shop.findMany({
      where: {
        name: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.ShopInclude,
    });
  }

  findOne(id: number, findOneShopDto: FindOneShopDto = {}) {
    const { keyword = '', include = [] } = findOneShopDto;

    return xprisma.shop.findUnique({
      where: {
        id,
        name: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.ShopInclude,
    });
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return xprisma.shop.update({ where: { id }, data: updateShopDto });
  }

  remove(id: number) {
    return xprisma.shop.delete({ where: { id } });
  }
}
