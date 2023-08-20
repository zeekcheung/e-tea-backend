import { PrismaClient, User } from '@prisma/client';
import { ModelWithoutBaseInfo, chainPromises } from './common';

type DummyUser = ModelWithoutBaseInfo<User>;

export const createDummyUsers = async (prisma: PrismaClient) => {
  const userInfos: DummyUser[] = [
    {
      role: 0,
      phone: '12345678901',
      openid: '12345678901',
      sessionKey: '12345678901',
      nickname: '张三',
      avatarUrl: 'https://picsum.photos/200',
    },
    {
      role: 1,
      phone: '12345678902',
      openid: '12345678902',
      sessionKey: '12345678902',
      nickname: '李四',
      avatarUrl: 'https://picsum.photos/200',
    },
    {
      role: 1,
      phone: '12345678903',
      openid: '12345678903',
      sessionKey: '12345678903',
      nickname: '王五',
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
