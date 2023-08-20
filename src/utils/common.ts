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
