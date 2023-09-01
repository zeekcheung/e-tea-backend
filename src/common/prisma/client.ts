import { PrismaExtension } from '@/types/prisma/extensions';
import { PrismaClient } from '@prisma/client';
import {
  obfuscatedFieldsExtension,
  queryLoggingExtension,
  softDeleteExtension,
} from './extensions';

/** prisma client instance without any extensions */
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

/**
 * apply extensions to prisma client instance
 */
export function applyPrismaExtension<
  T extends PrismaClient = PrismaClient,
  E = PrismaExtension,
>(prisma: T, extension: E) {
  return prisma.$extends(extension);
}

/** prisma client instance with obfuscated fields extension */
export const xprismaWithObfuscatedFields = applyPrismaExtension(
  prisma,
  obfuscatedFieldsExtension({}),
);

/** prisma client instance with query logging extension */
export const xprismaWithQueryLogging = applyPrismaExtension(
  prisma,
  queryLoggingExtension(),
);

/** prisma client instance with soft delete extension */
export const xprismaWithSoftDelete = applyPrismaExtension(
  prisma,
  softDeleteExtension(),
);

// TEST: implement xprisma with optional extensions

/** extended prisma client instance */
export const xprisma = prisma
  .$extends(queryLoggingExtension())
  .$extends(softDeleteExtension())
  .$extends(
    obfuscatedFieldsExtension({
      user: ['openid', 'sessionKey'],
    }),
  );
