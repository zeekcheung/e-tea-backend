import { pickKeysFromObject } from './base';

import configuration from '@/common/config/configuration';

/**
 * Get the function that Retrieves the configuration.
 *
 * `const getConfigByKeys = getConfiguration();`
 * `const { foo, bar } = getConfigByKeys('foo', 'bar');`
 */
export function getConfiguration() {
  const config = configuration();
  type Config = typeof config;

  /**
   * Retrieves configuration values by the given keys.
   *
   * @param keys - The keys to retrieve configuration values for.
   * @return A record containing the configuration values for the given keys.
   */
  return function getConfigByKeys(...keys: Array<keyof Config>) {
    return pickKeysFromObject(config, keys);
  };
}
