import { Response } from 'express';
import { TagType } from '../../types/response.types';
import { HTTP_STATUS } from '../../constants';
import { cleanObject } from '../../utils/cleanObject';

export const sendSuccess = (
  res: Response,
  message = 'Success',
  data: any = {},
  statusCode: number = HTTP_STATUS.OK,
  tag: TagType = 'untagged',
  meta?: any // pagination or metadata object
) => {
  return res.status(statusCode).json({
    success: true,
    tag,
    message,
    data: cleanObject(data),
    ...(meta ? { meta } : {}), // Include meta only if it exists
  });
};

export const sendError = (
  res: Response,
  statusCode: number = HTTP_STATUS.INTERNAL_ERROR,
  message = 'Internal Server Error',
  errors: any = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
