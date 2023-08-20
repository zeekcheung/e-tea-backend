import { SoftDeleteMiddle } from '../types/common';

/**
 * Generates a soft delete middleware function that can be used in an Nest.js application.
 *
 * @param  targetModels - an array of models to apply the soft delete functionality to
 * @param  targetField - the name of the field to use for marking deleted records
 * @return  - the generated soft delete middleware function
 */
export const softDeleteMiddleware: SoftDeleteMiddle = ({
  targetModels = [],
  targetField = 'deletedAt',
}) => {
  return async (params, next) => {
    // Check incoming query type
    if (targetModels.includes(params.model)) {
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
    }
    return next(params);
  };
};
