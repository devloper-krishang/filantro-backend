import { User } from '../model/user.model';
import { EmailVerification } from '../model/emailVerification.model';
import { resendEmailAgain } from '../../../emails/service/sendEmail';
import { Types } from 'mongoose';

export const verifyEmailCode = async (userId: string, code: string) => {
  const verification = await EmailVerification.findOne({
    userId,
    code,
    type: 'email-verification',
  });

  if (!verification) {
    return { success: false, message: 'Invalid or expired verification code' };
  }

  await Promise.all([
    User.updateOne({ _id: userId }, { isEmailVerified: true }),
    EmailVerification.deleteOne({ _id: verification._id }),
  ]);

  return { success: true, message: 'Code verified successfully' };
};

export const resendVerificationEmail = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    return { success: false, status: 404, message: 'User not found' };
  }

  if (!user.email) {
    return { success: false, status: 404, message: 'User email is missing' };
  }

  if (user.isEmailVerified) {
    return { success: false, status: 403, message: 'User is already verified' };
  }

  const code = await resendEmailAgain(userId as unknown as Types.ObjectId, user.email);

  return { success: true, message: 'Verification email sent successfully', code };
};
