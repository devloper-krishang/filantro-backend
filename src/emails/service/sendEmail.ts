import { sendEmail } from '../../utils';
import { generateNumericCode } from '../../utils/generateNumericCode';
import { renderVerifyEmailCodeTemplate } from '../templates/verifyEmail';
import { renderResetPasswordCodeTemplate } from '../templates/resetPassword';
import { Types } from 'mongoose';
import { EmailVerification } from '../../modules/user/model/emailVerification.model';
const EMAIL_VERIFICATION_TYPE = 'email-verification' as const;
const PASSWORD_RESET_TYPE = 'password-reset' as const;
const RESEND_LIMIT_WINDOW_HOURS = 2;

export const registerEmail = async (userId: Types.ObjectId, email: string) => {
  const code = generateNumericCode(6);

  await EmailVerification.findOneAndDelete({ userId, type: EMAIL_VERIFICATION_TYPE });

  await EmailVerification.create({
    userId,
    email,
    code,
    type: EMAIL_VERIFICATION_TYPE,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    attempts: 0,
    resendCount: 0,
  });

  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: renderVerifyEmailCodeTemplate(code),
  });

  return code;
};

export const resendEmailAgain = async (userId: Types.ObjectId, email: string) => {
  const code = generateNumericCode(6);

  const existing = await EmailVerification.findOne({
    userId,
    type: EMAIL_VERIFICATION_TYPE,
  });

  console.log('value check', existing);

  await EmailVerification.deleteOne({ _id: existing?._id });

  await EmailVerification.create({
    userId,
    email,
    code,
    type: EMAIL_VERIFICATION_TYPE,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    attempts: 0,
    // resendCount,
  });

  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: renderVerifyEmailCodeTemplate(code),
  });

  return code;
};

export const sendPasswordResetCode = async (userId: Types.ObjectId, email: string) => {
  const code = generateNumericCode(6);

  await EmailVerification.findOneAndDelete({ userId, type: PASSWORD_RESET_TYPE });

  await EmailVerification.create({
    userId,
    email,
    code,
    type: PASSWORD_RESET_TYPE,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    attempts: 0,
    resendCount: 0,
  });

  await sendEmail({
    to: email,
    subject: 'Your password reset code',
    html: renderResetPasswordCodeTemplate(code),
  });

  return code;
};
