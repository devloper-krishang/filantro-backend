import { HTTP_STATUS } from '../constants';
import { RoleType } from '../types';
import { sendError } from '../utils';
import { NextFunction, Request, Response } from 'express';

export const authorizeRoles = (...roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, 'You are not authorized');
    }
    next();
  };
};
