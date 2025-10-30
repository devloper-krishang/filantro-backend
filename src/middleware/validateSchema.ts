import { HTTP_STATUS } from '../constants';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils';
import { z, ZodSchema } from 'zod';

type ValidationSources = 'body' | 'query' | 'params';

export const validateSchema =
  (schema: ZodSchema, source: ValidationSources = 'body') =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return new Promise((resolve) => {
      try {
        schema.parse(req[source]);
        next();
        resolve();
      } catch (err: any) {
        sendError(res, HTTP_STATUS.INTERNAL_ERROR, 'Validation failed', err.errors);
        resolve();
      }
    });
  };

export const trimAfter = (schema: z.ZodString) => schema.transform((val) => val.trim());
