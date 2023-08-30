import { Product, ProductCategory, ProductSpecification } from '@prisma/client';

export const CREATE_PRODUCT_REQUIRED_KEYS: Array<keyof Product> = [
  'name',
  'imageUrl',
  'shopId',
];

export const CREATE_PRODUCT_CATEGORY_REQUIRED_KEYS: Array<
  keyof ProductCategory
> = ['name', 'shopId'];

export const CREATE_PRODUCT_SPECIFICATION_REQUIRED_KEYS: Array<
  keyof ProductSpecification
> = ['tag', 'name', 'price'];
