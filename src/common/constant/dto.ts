import type {
  Prisma,
  Product,
  ProductCategory,
  ProductSpecification,
} from '@prisma/client';

/* ======================== Create model required keys =======================  */

export const CreateProductRequiredKeys: Array<keyof Product> = [
  'name',
  'imageUrl',
  'shopId',
];

export const CreateProductCategoryRequiredKeys: Array<keyof ProductCategory> = [
  'name',
  'shopId',
];

export const CreateProductSpecificationRequiredKeys: Array<
  keyof ProductSpecification
> = ['tag', 'name', 'price'];

/* ======================= Create Model relation keys =======================  */
export const UserRelationKeys: Array<keyof Prisma.UserInclude> = ['shop'];

export const ShopRelationKeys: Array<keyof Prisma.ShopInclude> = [
  'products',
  'categories',
  'shopKeeper',
];

export const ProductRelationKeys: Array<keyof Prisma.ProductInclude> = [
  'shop',
  'categories',
  'specifications',
];

export const ProductCategoryRelationKeys: Array<
  keyof Prisma.ProductCategoryInclude
> = ['shop', 'products'];

export const ProductSpecificationRelationKeys: Array<
  keyof Prisma.ProductSpecificationInclude
> = ['products'];
