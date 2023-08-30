import { PrismaClient, Product } from '@prisma/client';
import { chainPromises, ModelWithoutBaseInfo } from './common';

type DummyProduct = Omit<ModelWithoutBaseInfo<Product>, 'sales'>;

export const createDummyProducts = async (prisma: PrismaClient) => {
  const productInfos: DummyProduct[] = [
    {
      name: 'Coffee1',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is the first product',
      stock: 100,
      status: 0,
      isExchangeable: true,
      exchangeLimit: 100,
      exchangeCost: 10,
      shopId: 1,
    },
    {
      name: 'Cola1',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my second product',
      stock: 200,
      status: 0,
      isExchangeable: false,
      exchangeLimit: 0,
      exchangeCost: 0,
      shopId: 1,
    },
    {
      name: 'Tea1',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my third product',
      stock: 300,
      status: 0,
      isExchangeable: false,
      exchangeLimit: 0,
      exchangeCost: 0,
      shopId: 1,
    },
    {
      name: 'Coffee2',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my fourth product',
      stock: 400,
      status: 0,
      isExchangeable: false,
      exchangeLimit: 0,
      exchangeCost: 0,
      shopId: 1,
    },
    {
      name: 'Cola2',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my fifth product',
      stock: 500,
      status: 0,
      isExchangeable: false,
      exchangeLimit: 0,
      exchangeCost: 0,
      shopId: 1,
    },
    {
      name: 'Tea2',
      imageUrl: 'https://picsum.photos/200',
      description: 'This is my sixth product',
      stock: 600,
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
