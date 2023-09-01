import {
  defaultPrismaExtensionOptions,
  type SoftDeletePrismaExtensionOptions,
} from '@/types/prisma/extensions';
import { Prisma } from '@prisma/client';
import { prisma } from '@/common/prisma/client';

export const softDeleteExtension = (
  options?: SoftDeletePrismaExtensionOptions,
) => {
  const { models, client = prisma } = {
    ...defaultPrismaExtensionOptions,
    ...options,
  };

  return Prisma.defineExtension({
    name: 'soft-delete',
    // @ts-ignore
    query: Object.fromEntries(
      models.map((model) => [
        model,
        {
          async update({ args, query }) {
            args = {
              ...args,
              data: {
                ...args.data,
                updatedAt: new Date(),
              },
            };

            return query(args);
          },
          async updateMany({ args, query }) {
            args = {
              ...args,
              data: {
                ...args.data,
                updatedAt: new Date(),
              },
            };

            return query(args);
          },
        },
      ]),
    ),
    // @ts-ignore
    model: Object.fromEntries(
      models.map((model) => [
        model,
        {
          async softDelete(id: number) {
            return await client[model].update({
              where: { id },
              data: { deletedAt: new Date() },
            });
          },
          async softDeleteMany(items: number[]) {
            return await client[model].updateMany({
              where: { id: { in: items } },
              data: { deletedAt: new Date() },
            });
          },
          async softFind(id: number) {
            return await client[model].findUnique({
              where: { id, deletedAt: { not: null } },
            });
          },
          async softFindMany() {
            return await client[model].findMany({
              where: { deletedAt: { not: null } },
            });
          },
          async softRestore(id: number) {
            return await client[model].update({
              where: { id },
              data: { deletedAt: null },
            });
          },
          async softRestoreMany(items: number[]) {
            return await client[model].updateMany({
              where: { id: { in: items } },
              data: { deletedAt: null },
            });
          },
        },
      ]),
    ),
  });
};
