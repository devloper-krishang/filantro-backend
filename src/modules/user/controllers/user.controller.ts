import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../constants';
import { sendSuccess, sendError } from '../../../utils';
import { verifyEmailCode, resendVerificationEmail } from '../service/user.service';

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { code } = req.body;

    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await verifyEmailCode(userId, code);

    if (!result.success) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, result.message);
    }

    return sendSuccess(res, result.message, { verified: true }, HTTP_STATUS.OK);
  } catch (err: any) {
    console.error('Verify Code Error:', err);
    return sendError(res, HTTP_STATUS.INTERNAL_ERROR, 'Something went wrong');
  }
};

export const resendEmail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await resendVerificationEmail(userId);

    if (!result.success) {
      return sendError(res, result.status || HTTP_STATUS.BAD_REQUEST, result.message);
    }

    return sendSuccess(res, result.message, HTTP_STATUS.OK);
  } catch (err: any) {
    console.error('Resend Email Error:', err);
    return sendError(res, HTTP_STATUS.INTERNAL_ERROR, 'Something went wrong');
  }
};
