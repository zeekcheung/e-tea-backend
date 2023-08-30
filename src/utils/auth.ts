import { User } from '@prisma/client';
import { Role } from '../types/model';

/**
 * Verifies if the current user is the target user.
 *
 * @param currentUser - The current user object.
 * @param targetUserId - The ID of the target user.
 * @return Whether the current user is the target user.
 */
export const verifyUserOwnership = (
  currentUser: User,
  targetUserId: number,
) => {
  if (!currentUser) {
    return false;
  }
  const isAdmin = currentUser.role === Role.ADMIN;
  const isOwner = currentUser.id === targetUserId;
  return isAdmin || isOwner;
};
