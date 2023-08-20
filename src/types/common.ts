import { Prisma } from '@prisma/client';

/**
 * 用户角色
 */
export enum Role {
  /**
   * 顾客
   */
  Customer = 0,
  /**
   * 商家
   */
  Shopkeeper = 1,
  /**
   * 管理员
   */
  Admin = 2,
}

/**
 * 软删除中间件
 */
export type SoftDeleteMiddle = (options: {
  targetModels?: Prisma.ModelName[];
  targetField?: string;
}) => Prisma.Middleware;

/**
 * 商品售卖状态
 */
export enum ProductStatus {
  /**
   * 审核中
   */
  UnderReview = 0,
  /**
   * 售卖中
   */
  InStock,
  /**
   * 已售罄
   */
  SoldOut,
  /**
   * 已下架
   */
  OffShelf,
}
