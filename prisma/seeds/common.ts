export interface BaseModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type ModelWithoutBaseInfo<Model> = Omit<Model, keyof BaseModel>;

export async function chainPromises<T = unknown>(promises: Promise<T>[]) {
  const results: T[] = [];

  for (const promise of promises) {
    results.push(await promise);
  }

  return results;
}
