/**
 * Filters out specified keys from an object recursively.
 *
 * @param obj - The object to filter keys from.
 * @param targetKeys - The array of keys to filter out.
 * @return
 */
export const filterKeysFromObject = (obj: any, targetKeys: string[]) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => filterKeysFromObject(item, targetKeys));
    return obj;
  }
  Object.keys(obj).forEach((key) => {
    if (targetKeys.includes(key)) {
      delete obj[key];
    } else {
      filterKeysFromObject(obj[key], targetKeys);
    }
  });
};

/**
 * Picks and returns specific keys from an object.
 *
 * @param obj - The object to pick keys from.
 * @param keys - The keys to pick from the object.
 * @return - An object containing only the specified keys.
 */
export function pickKeys<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

export function classifyIdAndDto<T extends number | object>(
  items: T[],
): [number[], Exclude<T, number>[]] {
  const idArr = [];
  const dtoArr = [];
  items.forEach((item) => {
    if (typeof item === 'number') {
      idArr.push(item);
    } else {
      dtoArr.push(item);
    }
  });
  return [idArr, dtoArr];
}
