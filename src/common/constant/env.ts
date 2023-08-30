import { NodeEnv } from '@/types/env';

export const NODE_ENV = (process.env.NODE_ENV as NodeEnv) || 'dev';
export const __DEV__ = NODE_ENV === 'dev' || NODE_ENV === 'development';
export const __PROD__ = NODE_ENV === 'prod' || NODE_ENV === 'production';
export const __DEBUG__ = NODE_ENV === 'debug';

export const DEFAULT_ENV_FILE_PATH = '.env';
export const ENV_FILE_PATH = `${DEFAULT_ENV_FILE_PATH}.${NODE_ENV}`;
