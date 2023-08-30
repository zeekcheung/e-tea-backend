import { Role } from '@/types/model';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_PROTECTED_KEY = 'isProtected';
export const AUTH_KEY = 'Auth';

/**
 * `@Public` 所有用户都可以访问
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * `@Protected` 所有登录用户才可以访问
 */
export const Protected = () => SetMetadata(IS_PROTECTED_KEY, true);

/**
 * `@Auth` 只有授权的用户才可以访问
 * @param roles 授权的角色
 */
export const Auth = (...roles: Role[]) => SetMetadata(AUTH_KEY, roles);
