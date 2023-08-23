import { config } from 'dotenv';
import { pickKeys } from '../utils/common';

export default function configuration() {
  // 加载 .env 中的环境变量
  config();
  const env = process.env;

  // 初始化所有环境变量
  return {
    [PORT_KEY]: parseInt(env[PORT_KEY], 10) || 3000,
    [API_GLOBAL_PREFIX]: env[API_GLOBAL_PREFIX] || '',

    [POSTGRES_USER]: env[POSTGRES_USER],
    [POSTGRES_PASSWORD]: env[POSTGRES_PASSWORD],
    [POSTGRES_DB]: env[POSTGRES_DB],

    [DB_HOST]: env[DB_HOST] || 'localhost',
    [DB_PORT]: parseInt(env[DB_PORT], 10) || 5432,
    [DB_SCHEMA]: env[DB_SCHEMA] || 'public',

    [JWT_SECRET]: env[JWT_SECRET] || 'secret',
    [JWT_EXPIRES_IN]: env[JWT_EXPIRES_IN] || '1d',

    [HTTPS]: env[HTTPS] || false,
    [SSL_KEY]: env[SSL_KEY] || './ssl/private.key',
    [SSL_CERT]: env[SSL_CERT] || './ssl/certificate.crt',

    [OSS_ACCESS_KEY_ID]: env[OSS_ACCESS_KEY_ID],
    [OSS_ACCESS_KEY_SECRET]: env[OSS_ACCESS_KEY_SECRET],
    [OSS_TIMEOUT]: env[OSS_TIMEOUT] || 1,
    [OSS_MAX_SIZE]: env[OSS_MAX_SIZE] || 10,
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
export const POSTGRES_USER = 'POSTGRES_USER';
export const POSTGRES_PASSWORD = 'POSTGRES_PASSWORD';
export const POSTGRES_DB = 'POSTGRES_HOST';

export const DB_HOST = 'DB_HOST';
export const DB_PORT = 'DB_PORT';
export const DB_SCHEMA = 'DB_SCHEMA';

export const PORT_KEY = 'PORT';
export const API_GLOBAL_PREFIX = 'API_GLOBAL_PREFIX';

export const JWT_SECRET = 'JWT_ACCESS_SECRET';
export const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';

export const HTTPS = 'HTTPS';
export const SSL_KEY = 'SSL_KEY';
export const SSL_CERT = 'SSL_CERT';

export const OSS_ACCESS_KEY_ID = 'OSS_ACCESS_KEY_ID';
export const OSS_ACCESS_KEY_SECRET = 'OSS_ACCESS_KEY_SECRET';
export const OSS_TIMEOUT = 'OSS_TIMEOUT';
export const OSS_MAX_SIZE = 'OSS_MAX_SIZE';
