export const CreateOperations = ['create', 'createMany'] as const

export const UpdateOperations = ['update', 'updateMany'] as const
export const UpsertOperations = ['upsert'] as const
export const DeleteOperations = ['delete', 'deleteMany'] as const

export const QuerySummaryOperations = ['count', 'aggregate', 'groupBy'] as const

export const QueryUniqueOperations = ['findUnique', 'findUniqueOrThrow'] as const
export const QueryStandardOperations = ['findFirst', 'findFirstOrThrow', 'findMany'] as const

export const QueryOperations = [
  ...QuerySummaryOperations,
  ...QueryUniqueOperations,
  ...QueryStandardOperations,
] as const
export const MutationOperations = [
  ...CreateOperations,
  ...UpdateOperations,
  ...UpsertOperations,
  ...DeleteOperations,
] as const

export type CreateOperation = (typeof CreateOperations)[number]
export type UpdateOperation = (typeof UpdateOperations)[number]
export type UpsertOperation = (typeof UpsertOperations)[number]
export type DeleteOperation = (typeof DeleteOperations)[number]

export type QuerySummaryOperation = (typeof QuerySummaryOperations)[number]
export type QueryUniqueOperation = (typeof QueryUniqueOperations)[number]
export type QueryStandardOperation = (typeof QueryStandardOperations)[number]

export type QueryOperation = (typeof QueryOperations)[number]

export type MutationOperation = (typeof MutationOperations)[number]
