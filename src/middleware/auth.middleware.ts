import env from '../config/env';
import { HTTP_STATUS } from '../constants';
import { sendError } from '../utils';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;

    (req as any).user = decoded;

    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token expired. Please login again.');
    }
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token.');
  }
};
