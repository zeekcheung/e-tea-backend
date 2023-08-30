import { Prisma } from '@prisma/client';
import { SoftDeleteMiddleware } from '@/types/middleware';

/**
 * Generates a soft delete middleware function that can be used in an Nest.js application.
 *
 * @param targetModels - an array of models to apply the soft delete functionality to
 * @param targetField - the name of the field to use for marking deleted records
 * @return  - the generated soft delete middleware function
 */
export const softDeleteMiddleware: SoftDeleteMiddleware = ({
  targetModels = [],
  targetField = 'deletedAt',
}) => {
  return async (params, next) => {
    params.args = params.args || {};
    // Check incoming query type
    if (targetModels.includes(params.model)) {
      // TEST: 软删除中间件
      interceptDeleteQuery(params, targetField);
      interceptFindQuery(params, targetField);
      interceptUpdateQuery(params, targetField);
    }
    return next(params);
  };
};

type SoftDeleteInterceptor = (
  params: Prisma.MiddlewareParams,
  targetField: string,
) => void;

/**
 * Intercept delete queries and modify them to update queries.
 *
 * @param params - The parameters of the interceptor.
 * @param targetField - The target field to be updated.
 */
const interceptDeleteQuery: SoftDeleteInterceptor = (params, targetField) => {
  if (params.action == 'delete') {
    // Delete queries
    // Change action to an update
    params.action = 'update';
    params.args['data'] = { [targetField]: new Date() };
  }
  if (params.action == 'deleteMany') {
    // Delete many queries
    params.action = 'updateMany';
    if (params.args.data != undefined) {
      params.args.data['deleted'] = true;
    } else {
      params.args['data'] = { [targetField]: new Date() };
    }
  }
};

/**
 * Intercepts the find query and modify it for soft delete functionality.
 *
 * @param params - The parameters for the find query.
 * @param targetField - The target field for filtering.
 */
const interceptFindQuery: SoftDeleteInterceptor = (params, targetField) => {
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    // Change to findFirst - you cannot filter
    // by anything except ID / unique with findUnique
    params.action = 'findFirst';
    // Add 'deleted' filter
    // ID filter maintained
    params.args.where = {
      ...params.args.where,
      [targetField]: { equals: null },
    };
  }
  if (params.action === 'findMany') {
    // Find many queries
    if (params.args.where) {
      if (params.args.where[targetField] == undefined) {
        // Exclude deleted records if they have not been explicitly requested
        params.args.where = {
          ...params.args.where,
          [targetField]: { equals: null },
        };
      }
    } else {
      params.args['where'] = {
        [targetField]: { equals: null },
      };
    }
  }
};

/**
 * Intercept the update query and modify it for soft delete functionality.
 *
 * @param params - The parameters for the update query.
 * @param targetField - The field to target for soft delete.
 */
const interceptUpdateQuery: SoftDeleteInterceptor = (params, targetField) => {
  if (params.action == 'update') {
    // Change to updateMany - you cannot filter
    // by anything except ID / unique with findUnique
    params.action = 'updateMany';
    // Add 'deleted' filter
    // ID filter maintained
    params.args.where = {
      ...params.args.where,
      [targetField]: { equals: null },
    };
  }
  if (params.action == 'updateMany') {
    if (params.args.where != undefined) {
      params.args.where = {
        ...params.args.where,
        [targetField]: { equals: null },
      };
    } else {
      params.args['where'] = {
        [targetField]: { equals: null },
      };
    }
  }
};
