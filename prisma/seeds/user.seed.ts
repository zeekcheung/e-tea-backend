import { PrismaClient, User } from '@prisma/client';
import * as bycrypt from 'bcrypt';
import { ModelWithoutBaseInfo, chainPromises } from './common';

type DummyUser = ModelWithoutBaseInfo<User>;

export const createDummyUsers = async (prisma: PrismaClient) => {
  const roundsOfHashing = 10;

  const userInfos: DummyUser[] = [
    {
      role: 0,
      phone: '12345678901',
      password: await bycrypt.hash('Xy8@Lg2z!', roundsOfHashing),
    },
    {
      role: 1,
      phone: '12345678902',
      password: await bycrypt.hash('P#9sRj4n@', roundsOfHashing),
    },
    {
      role: 1,
      phone: '12345678903',
      password: await bycrypt.hash('D@5mGh1b$', roundsOfHashing),
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
