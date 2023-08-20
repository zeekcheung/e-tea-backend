import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ConflictException } from '../../exceptions/conflict.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 判断用户是否存在
    const user = await this.prisma.user.findFirst({
      where: {
        openid: createUserDto.openid,
        role: createUserDto.role,
      },
    });
    if (user) {
      throw new ConflictException(
        `user already exists, openid: ${user.openid}`,
      );
    }

    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findUnique(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findFirst(where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({ where });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
