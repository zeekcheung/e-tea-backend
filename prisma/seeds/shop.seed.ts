import { PrismaClient, Shop } from '@prisma/client';
import { chainPromises, ModelWithoutBaseInfo } from './common';

type DummyShop = Omit<ModelWithoutBaseInfo<Shop>, 'grade'>;

export const createDummyShops = async (prisma: PrismaClient) => {
  const shopInfos: DummyShop[] = [
    {
      name: 'E-Tea',
      avatarUrl: 'https://picsum.photos/200',
      introduction: 'This is the first shop',
      latitude: 22.66107390576057,
      longitude: 113.42020520075879,
      address: 'ZhongShan',
      shopKeeperId: 1,
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
