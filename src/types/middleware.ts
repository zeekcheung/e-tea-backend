import { Prisma } from '@prisma/client';

/**
 * 软删除中间件
 */
export type SoftDeleteMiddleware = (options: {
  targetModels?: Prisma.ModelName[];
  targetField?: string;
}) => Prisma.Middleware;
