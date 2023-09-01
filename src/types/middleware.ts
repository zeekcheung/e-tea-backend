import { Prisma } from '@prisma/client';

export type SoftDeleteMiddleware = (options: {
  targetModels?: Prisma.ModelName[];
  targetField?: string;
}) => Prisma.Middleware;
