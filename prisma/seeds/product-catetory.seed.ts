import { PrismaClient, ProductCategory } from '@prisma/client';
import { chainPromises, ModelWithoutBaseInfo } from './common';

type DummyProductCategory = ModelWithoutBaseInfo<ProductCategory> & {
  products: number[];
};

export const createDummyProductCategories = async (prisma: PrismaClient) => {
  const productCategoryInfos: DummyProductCategory[] = [
    {
      name: 'Juice',
      description: 'This is the first product category',
      order: 1,
      shopId: 1,
      products: [1, 2],
    },
    {
      name: 'Tea',
      description: 'This is the second product category',
      order: 2,
      shopId: 1,
      products: [],
    },
  ];

  const productCategories = await chainPromises(
    productCategoryInfos.map(({ shopId, products, ...rest }) => {
      return prisma.productCategory.create({
        data: {
          ...rest,
          shop: {
            connect: { id: shopId },
          },
          products: {
            connect: products.map((id) => ({ id })),
          },
        },
      });
    }),
  );

  return productCategories;
};
