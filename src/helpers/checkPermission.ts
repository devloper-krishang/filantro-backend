import { IRole, Role } from '../models/role';
import { IUser, User } from '../modules/user';
import { findById, findOne } from '../utils';

/**
 * Checks if the user has a specific permission (via key)
 * @param userId - Mongo ObjectId string
 * @param permissionKey - e.g. "ads_read"
 * @returns true if permission is granted
 */

export async function userHasPermission(userId: string, permissionKey: string): Promise<boolean> {
  try {
    // Step 1: Fetch user (only isSuperAdmin + roleKey fields)
    const user = await findById<IUser>(User, userId, 'isSuperAdmin roleKey');
    if (!user) return false;

    // Step 2: Super Admin bypass
    if (user.isSuperAdmin) return true;

    // Step 3: Fetch role (only permissions field)
    const role = await findOne<IRole>(Role, { key: user.entityType }, 'permissions');
    if (!role) return false;

    // Step 4: Check if role has this permission
    return role.permissions.includes(permissionKey);
  } catch (error) {
    console.error('❌ userHasPermission error:', error);
    return false;
  }
}
