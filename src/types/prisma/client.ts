import {
  xprisma,
  xprismaWithQueryLogging,
  xprismaWithSoftDelete,
} from '@/common/prisma/client';
import type { Prisma } from '@prisma/client';
import {
  DynamicClientExtensionThis,
  ITXClientDenyList,
  TypeMapCbDef,
  TypeMapDef,
} from '@prisma/client/runtime/library';

export type PrismaClientWithConfiguration<
  T extends Prisma.DefaultPrismaClient = Prisma.DefaultPrismaClient,
> = T & {
  _activeProvider?: string; // Option in case this changes in the future
};

export type PrismaClientWithQueryLogging = typeof xprismaWithQueryLogging;

export type PrismaClientWithSoftDelete = typeof xprismaWithSoftDelete;

export type PrismaErrorCodeMappings = Record<string, number>;

export type PrismaClientWithExtensions = typeof xprisma;

export type PrismaClientInTransaction = Omit<
  DynamicClientExtensionThis<TypeMapDef, TypeMapCbDef, Record<string, any>>,
  ITXClientDenyList
>;
