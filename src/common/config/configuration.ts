import { config } from 'dotenv';
import {
  API_GLOBAL_PREFIX,
  DB_HOST,
  DB_PORT,
  DB_SCHEMA,
  HTTPS_ENABLE,
  JWT_ENABLE,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  OSS_ACCESS_KEY_ID,
  OSS_ACCESS_KEY_SECRET,
  OSS_MAX_SIZE,
  OSS_TIMEOUT,
  PORT,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  SSL_CERT,
  SSL_KEY,
  WX_APP_ID,
  WX_APP_SECRET,
  WX_ENABLE,
} from '../constant/config';
import { ENV_FILE_PATH } from '../constant/env';

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
