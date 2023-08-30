/**
 * Omit specified keys from an object recursively.
 *
 * @param obj - The object to omit keys from.
 * @param keys - The  keys to omit from the object.
 * @return - An object without the specified keys.
 */
export function omitKeysFromObject<T, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => omitKeysFromObject(item, keys));
    return obj;
  }
  Reflect.ownKeys(obj).forEach((key) => {
    if (keys.includes(key as K)) {
      delete obj[key];
    } else {
      omitKeysFromObject(obj[key], keys);
    }
  });
  return obj;
}

/**
 * Picks and returns specific keys from an object.
 *
 * @param obj - The object to pick keys from.
 * @param keys - The keys to pick from the object.
 * @return - An object containing only the specified keys.
 */
export function pickKeysFromObject<T, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}
