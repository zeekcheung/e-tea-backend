import {
  defaultPrismaExtensionOptions,
  type QueryLoggingPrismaExtensionOptions,
} from '@/types/prisma/extensions';
import { Prisma } from '@prisma/client';
import { performance } from 'perf_hooks';
import * as util from 'util';

export const queryLoggingExtension = (
  options?: QueryLoggingPrismaExtensionOptions,
) => {
  const {
    models,
    inspectOptions = { showHidden: false, depth: null, colors: true },
  } = {
    ...defaultPrismaExtensionOptions,
    ...options,
  };

  return Prisma.defineExtension({
    // @ts-ignore
    query: Object.fromEntries(
      models.map((model) => [
        model,
        {
          async $allOperations({ operation, model, args, query }) {
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            const time = end - start;

            console.log(
              util.inspect({ model, operation, args, time }, inspectOptions),
            );

            return result;
          },
        },
      ]),
    ),
  });
};
