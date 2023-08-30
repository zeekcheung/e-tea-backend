import { PrismaClient, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { chainPromises, ModelWithoutBaseInfo } from './common';
import { Role } from '../../src/types/model';

type DummyUser = ModelWithoutBaseInfo<User>;

export const createDummyUsers = async (prisma: PrismaClient) => {
  const userInfos: DummyUser[] = [
    {
      role: Role.SHOPKEEPER,
      openid: uuidv4(),
      sessionKey: uuidv4(),
      phone: '12345678901',
      nickname: 'Boss1',
      avatarUrl: 'https://picsum.photos/200',
    },
    {
      role: Role.CUSTOMER,
      openid: uuidv4(),
      sessionKey: uuidv4(),
      phone: '12345678902',
      nickname: 'Customer1',
      avatarUrl: 'https://picsum.photos/200',
    },
    {
      role: Role.ADMIN,
      openid: uuidv4(),
      sessionKey: uuidv4(),
      phone: '12345678903',
      nickname: 'Admin1',
      avatarUrl: 'https://picsum.photos/200',
    },
  ];

  const users = await chainPromises(
    userInfos.map((userInfo) => {
      return prisma.user.create({
        data: userInfo,
      });
    }),
  );

  return users;
};
