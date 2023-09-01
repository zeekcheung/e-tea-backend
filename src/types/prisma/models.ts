import type { Prisma } from '@prisma/client';

export type AllModelsKey = '$allModels';

export type PrismaModelName = `${Uncapitalize<keyof typeof Prisma.ModelName>}`;

export type PrismaModelNames<AllowAll extends boolean = false> =
  (AllowAll extends true ? PrismaModelName | AllModelsKey : PrismaModelName)[];
