import { config } from 'dotenv';
import { pickKeys } from '../utils/common';
import { ENV_FILE_PATH, NODE_ENV } from '../utils/env';

export default function configuration() {
  // 加载 .env 中的环境变量
  config({
    path: ENV_FILE_PATH,
  });

  const env = process.env;

  // 初始化所有环境变量
  return {
    [PORT]: parseInt(env[PORT], 10) || 3000,
    [API_GLOBAL_PREFIX]: env[API_GLOBAL_PREFIX] || '',

    [POSTGRES_USER]: env[POSTGRES_USER],
    [POSTGRES_PASSWORD]: env[POSTGRES_PASSWORD],
    [POSTGRES_DB]: env[POSTGRES_DB],

    [DB_HOST]: env[DB_HOST] || 'localhost',
    [DB_PORT]: parseInt(env[DB_PORT], 10) || 5432,
    [DB_SCHEMA]: env[DB_SCHEMA] || 'public',

    [JWT_ENABLE]: env[JWT_ENABLE] === 'true' || false,
    [JWT_SECRET]: env[JWT_SECRET] || 'secret',
    [JWT_EXPIRES_IN]: env[JWT_EXPIRES_IN] || '1d',

    [HTTPS_ENABLE]: env[HTTPS_ENABLE] === 'true' || false,
    [SSL_KEY]: env[SSL_KEY] || './ssl/private.key',
    [SSL_CERT]: env[SSL_CERT] || './ssl/certificate.crt',

    [OSS_ACCESS_KEY_ID]: env[OSS_ACCESS_KEY_ID],
    [OSS_ACCESS_KEY_SECRET]: env[OSS_ACCESS_KEY_SECRET],
    [OSS_TIMEOUT]: parseInt(env[OSS_TIMEOUT], 10) || 1,
    [OSS_MAX_SIZE]: parseInt(env[OSS_MAX_SIZE], 10) || 10,

    [WX_ENABLE]: env[WX_ENABLE] === 'true' || false,
    [WX_APP_ID]: env[WX_APP_ID],
    [WX_APP_SECRET]: env[WX_APP_SECRET],
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
export const POSTGRES_DB = 'POSTGRES_DB';

export const DB_HOST = 'DB_HOST';
export const DB_PORT = 'DB_PORT';
export const DB_SCHEMA = 'DB_SCHEMA';

export const PORT = 'PORT';
export const API_GLOBAL_PREFIX = 'API_GLOBAL_PREFIX';

export const JWT_ENABLE = 'JWT_ENABLE';
export const JWT_SECRET = 'JWT_ACCESS_SECRET';
export const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';

export const HTTPS_ENABLE = 'HTTPS_ENABLE';
export const SSL_KEY = 'SSL_KEY';
export const SSL_CERT = 'SSL_CERT';

export const OSS_ACCESS_KEY_ID = 'OSS_ACCESS_KEY_ID';
export const OSS_ACCESS_KEY_SECRET = 'OSS_ACCESS_KEY_SECRET';
export const OSS_TIMEOUT = 'OSS_TIMEOUT';
export const OSS_MAX_SIZE = 'OSS_MAX_SIZE';

export const WX_ENABLE = 'WX_ENABLE';
export const WX_APP_ID = 'WX_APP_ID';
export const WX_APP_SECRET = 'WX_APP_SECRET';
