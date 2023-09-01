import { uniqueArray } from './base';

/**
 * Transform include keys to include object
 * @param includeKeys include keys
 * @return include object
 */
export function transformIncludeKeys(
  includeKeys: string[],
): Record<string, boolean> {
  return Object.fromEntries(uniqueArray(includeKeys).map((key) => [key, true]));
}
