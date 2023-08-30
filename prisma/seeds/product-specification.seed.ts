import { PrismaClient, ProductSpecification } from '@prisma/client';
import { chainPromises, ModelWithoutBaseInfo } from './common';

type DummyProductSpecification = ModelWithoutBaseInfo<ProductSpecification> & {
  products: number[];
};

export const createDummyProductSpecifications = async (
  prisma: PrismaClient,
) => {
  const productSpecificationInfos: DummyProductSpecification[] = [
    {
      name: '大杯',
      tag: '容量',
      price: 8.0,
      products: [1, 2],
    },
    {
      name: '中杯',
      tag: '容量',
      price: 6.0,
      products: [1, 2],
    },
    {
      name: '小杯',
      tag: '容量',
      price: 4.0,
      products: [1, 2],
    },
    ,
  ];

  const productSpecifications = await chainPromises(
    productSpecificationInfos.map(({ products, ...rest }) => {
      return prisma.productSpecification.create({
        data: {
          ...rest,
          products: {
            connect: products.map((id) => ({ id })),
          },
        },
      });
    }),
  );

  return productSpecifications;
};
