import { PrismaModelName } from '@/types/prisma/models';
import { Prisma } from '@prisma/client';

/**
 * Prevents sensitive data (e.g. `password` fields) from being inclued in results
 */
export const obfuscatedFieldsExtension = <
  T extends PrismaModelName = PrismaModelName,
>(
  obfuscatedFieldsMapping: Record<T, string[]>,
) => {
  const result: Record<string, Record<string, unknown>> = {};
  Object.entries<string[]>(obfuscatedFieldsMapping).forEach(
    ([model, fields]) => {
      result[model] = fields.reduce((obj, field) => {
        obj[field] = {
          needs: {},
          compute() {
            return undefined;
          },
        };
        return obj;
      }, {});
    },
  );

  return Prisma.defineExtension({
    name: 'obfuscated-fields',
    // @ts-ignore
    result,
  });
};
