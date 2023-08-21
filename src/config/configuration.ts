import { config } from 'dotenv';
import { pickKeys } from '../utils/common';

export default function configuration() {
  // 加载 .env 中的环境变量
  config();
  const env = process.env;

  // 初始化所有环境变量
  return {
    [PORT_KEY]: parseInt(env[PORT_KEY], 10) || 3000,
    [API_GLOBAL_PREFIX_KEY]: env[API_GLOBAL_PREFIX_KEY] || '',

    [POSTGRES_USER_KEY]: env[POSTGRES_USER_KEY],
    [POSTGRES_PASSWORD_KEY]: env[POSTGRES_PASSWORD_KEY],
    [POSTGRES_DB_KEY]: env[POSTGRES_DB_KEY],

    [DB_HOST_KEY]: env[DB_HOST_KEY] || 'localhost',
    [DB_PORT_KEY]: parseInt(env[DB_PORT_KEY], 10) || 5432,
    [DB_SCHEMA_KEY]: env[DB_SCHEMA_KEY] || 'public',

    [JWT_SECRET_KEY]: env[JWT_SECRET_KEY] || 'secret',
    [JWT_EXPIRES_IN_KEY]: env[JWT_EXPIRES_IN_KEY] || '1d',

    [HTTPS_KEY]: env[HTTPS_KEY] || false,
    [SSL_KEY]: env[SSL_KEY] || './ssl/private.key',
    [SSL_CERT]: env[SSL_CERT] || './ssl/certificate.crt',
  };
}

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
    return pickKeys(config, keys);
  };
}
export const POSTGRES_USER_KEY = 'POSTGRES_USER';
export const POSTGRES_PASSWORD_KEY = 'POSTGRES_PASSWORD';
export const POSTGRES_DB_KEY = 'POSTGRES_HOST';

export const DB_HOST_KEY = 'DB_HOST';
export const DB_PORT_KEY = 'DB_PORT';
export const DB_SCHEMA_KEY = 'DB_SCHEMA';

export const PORT_KEY = 'PORT';
export const API_GLOBAL_PREFIX_KEY = 'API_GLOBAL_PREFIX';

export const JWT_SECRET_KEY = 'JWT_ACCESS_SECRET';
export const JWT_EXPIRES_IN_KEY = 'JWT_EXPIRES_IN';

export const HTTPS_KEY = 'HTTPS';
export const SSL_KEY = 'SSL_KEY';
export const SSL_CERT = 'SSL_CERT';
