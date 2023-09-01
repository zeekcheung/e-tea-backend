import type { Role } from '@/types/model';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_PROTECTED_KEY = 'isProtected';
export const AUTH_KEY = 'Auth';

/**
 * `@Public` All users can access
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * `@Protected` Only authenticated users can access
 */
export const Protected = () => SetMetadata(IS_PROTECTED_KEY, true);

/**
 * `@Auth` Only authorized users can access
 * @param roles Role
 */
export const Auth = (...roles: Role[]) => SetMetadata(AUTH_KEY, roles);
