import { PrismaClient, Shop } from '@prisma/client';
import { ModelWithoutBaseInfo, chainPromises } from './common';

type DummyShop = ModelWithoutBaseInfo<Shop>;

export const createDummyShops = async (prisma: PrismaClient) => {
  const shopInfos: DummyShop[] = [
    {
      name: 'My Shop1',
      avatarUrl: 'https://picsum.photos/200',
      introduction: 'This is my first shop',
      grade: 0,
      address: 'Shanghai',
      shopKeeperId: 2,
    },
  ];

  const shops = await chainPromises(
    shopInfos.map(({ shopKeeperId, ...rest }) => {
      return prisma.shop.create({
        data: {
          ...rest,
          shopKeeper: {
            connect: { id: shopKeeperId },
          },
        },
      });
    }),
  );

  return shops;
};
