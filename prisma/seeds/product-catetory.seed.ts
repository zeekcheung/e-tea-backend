import { PrismaClient, ProductCategory } from '@prisma/client';
import { ModelWithoutBaseInfo, chainPromises } from './common';

type DummyProductCategory = ModelWithoutBaseInfo<ProductCategory> & {
  products: number[];
};

export const createDummyProductCategories = async (prisma: PrismaClient) => {
  const productCategoryInfos: DummyProductCategory[] = [
    {
      name: 'ProductCategory1',
      description: 'This is my first product category',
      order: 1,
      shopId: 1,
      products: [1, 2],
    },
    {
      name: 'ProductCategory2',
      description: 'This is my second product category',
      order: 2,
      shopId: 1,
      products: [1, 2],
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
