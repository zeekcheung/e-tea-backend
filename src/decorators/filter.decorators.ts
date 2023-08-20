import { SetMetadata } from '@nestjs/common';

export const FILTER_KEYS = 'FILTER_KEYS';
export const FilterKeys = (...keys: string[]) => SetMetadata(FILTER_KEYS, keys);
