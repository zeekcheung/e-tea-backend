import type { InspectOptions } from 'node:util';
import type { PrismaModelNames } from './models';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientWithConfiguration } from './client';

export type PrismaExtension = ReturnType<typeof Prisma.defineExtension>;

export interface PrismaExtensionOptions {
  models?: PrismaModelNames<true>;
}

export const defaultPrismaExtensionOptions: PrismaExtensionOptions = {
  models: ['$allModels'],
};

export interface QueryLoggingPrismaExtensionOptions
  extends PrismaExtensionOptions {
  inspectOptions?: InspectOptions;
}

export interface SoftDeletePrismaExtensionOptions
  extends PrismaExtensionOptions {
  client: PrismaClient | PrismaClientWithConfiguration;
}
