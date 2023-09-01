import {
  xprismaWithQueryLogging,
  xprismaWithSoftDelete,
} from '@/common/prisma/client';
import type { Prisma } from '@prisma/client';

export type PrismaClientWithConfiguration<
  T extends Prisma.DefaultPrismaClient = Prisma.DefaultPrismaClient,
> = T & {
  _activeProvider?: string; // Option in case this changes in the future
};

export type PrismaClientWithQueryLogging = typeof xprismaWithQueryLogging;

export type PrismaClientWithSoftDelete = typeof xprismaWithSoftDelete;

export type PrismaErrorCodeMappings = Record<string, number>;
