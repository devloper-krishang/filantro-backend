import { userHasPermission } from '../helpers/checkPermission';
import { ForbiddenError, UnauthorizedError } from '../utils';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware: Checks if user has the required permission
 * @param permissionKey - e.g. 'ads_publish'
 */

export const requirePermission = (permissionKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?._id;

      // If user ID is not present (should be set by auth middleware)
      if (!userId) {
        throw new UnauthorizedError('User not authenticated');
      }

      const hasAccess = await userHasPermission(userId, permissionKey);

      if (!hasAccess) {
        throw new ForbiddenError(`Missing required permission: ${permissionKey}`);
      }

      return next();
    } catch (err) {
      next(err); // pass error to global handler or sendError middleware
    }
  };
};

/// usage
// router.post(
//   '/ads',
//   requirePermission('ads_publish'), // 🛡️ permission check middleware
//   createAdHandler
// );
