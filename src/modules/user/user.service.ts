import { xprisma } from '@/common/prisma/client';
import { transformIncludeKeys } from '@/utils/dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor() { }

  async create(createUserDto: CreateUserDto) {
    return xprisma.user.create({ data: createUserDto });
  }

  findAll(findAllUserDto?: FindAllUsersDto) {
    const { keyword = '', include = [] } = findAllUserDto;

    // fuzzy search users and include relationships
    return xprisma.user.findMany({
      where: {
        nickname: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.UserInclude,
    });
  }

  findUnique(id: number, findOneUserDot?: FindOneUserDto) {
    const { keyword = '', include = [] } = findOneUserDot;
    // fuzzy search user and include relationships
    return xprisma.user.findUnique({
      where: {
        id,
        nickname: { contains: keyword },
      },
      include: transformIncludeKeys(include) as Prisma.UserInclude,
    });
  }

  findFirst(where: Prisma.UserWhereInput) {
    return xprisma.user.findFirst({ where });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return xprisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return xprisma.user.delete({ where: { id } });
  }
}
