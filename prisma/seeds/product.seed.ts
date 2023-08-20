import { PrismaClient, Product } from '@prisma/client';
import { ModelWithoutBaseInfo, chainPromises } from './common';

type DummyProduct = ModelWithoutBaseInfo<Product>;

export const createDummyProducts = async (prisma: PrismaClient) => {
  const productInfos: DummyProduct[] = [
    {
      name: 'Product1',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my first product',
      stock: 0,
      sales: 0,
      status: 0,
      isExchangeable: true,
      exchangeLimit: 100,
      exchangeCost: 10,
      shopId: 1,
    },
    {
      name: 'Product2',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my second product',
      stock: 100,
      sales: 0,
      status: 0,
      isExchangeable: false,
      exchangeLimit: 0,
      exchangeCost: 0,
      shopId: 1,
    },
  ];

  const products = await chainPromises(
    productInfos.map(({ shopId, ...rest }) => {
      return prisma.product.create({
        data: {
          ...rest,
          shop: {
            connect: { id: shopId },
          },
        },
      });
    }),
  );

  return products;
};
