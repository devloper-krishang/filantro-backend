import { IUser, User } from '../../../modules/user/model/user.model';
import {
  ConflictError,
  generateToken,
  NotFoundError,
  UnauthorizedError,
  verifyToken,
} from '../../../utils';
import env from '../../../config/env';
import { AUTH_MESSAGES } from '../../../constants/messages';
import { comparePassword, hashPassword } from '../utils/authUtils';
import * as db from '../../../utils/dbUtils';
import {
  SignupInput,
  LoginInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ForgotPasswordInput,
} from '../interface/auth.types';
import { registerEmail, sendPasswordResetCode } from '../../../emails/service/sendEmail';
import { Types } from 'mongoose';
import { EmailVerification } from '../../user/model/emailVerification.model';

export const registerService = async ({
  name,
  lastname,
  entityName,
  jobTitle,
  telephone,
  email,
  password,
  entityType,
}: SignupInput) => {
  const existing = await db.findOne<IUser>(User, { email }, 'email');
  if (existing) throw new ConflictError(AUTH_MESSAGES.ERROR.EMAIL_IN_USE);

  if (entityType === 'government' && !/\.gov$/i.test(email)) {
    throw new ConflictError('Government emails must end with .gov');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    lastname,
    entityName,
    jobTitle,
    telephone,
    email,
    password: hashedPassword,
    entityType,
  });

  await registerEmail(user._id as Types.ObjectId, email);

  return { id: user._id, email: user.email };
};

export const loginService = async ({ email, password }: LoginInput) => {
  const user = await db.findOne<IUser>(User, { email });
  if (!user) throw new UnauthorizedError(AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new UnauthorizedError(AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);

  const accessToken = generateToken(
    { id: user._id, role: user.entityType },
    env.jwt.accessExpirationMinutes
  );

  return {
    accessToken,
    user: {
      // id: user._id,
      email: user.email,
      name: user.name,
    },
  };
};

export const checkSession = async (userId: string) => {
  if (!userId) {
    return {
      message: 'Unauthorized access.',
      data: { authenticated: false, verified: false },
    };
  }

  const user = await db.findById<IUser>(User, userId);
  if (!user) {
    return {
      message: 'User not found.',
      data: { authenticated: false, verified: false },
    };
  }

  if (!user.isEmailVerified) {
    return {
      message: 'Email not verified.',
      data: {
        authenticated: true,
        verified: false,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
  }

  return {
    message: 'User authenticated.',
    data: {
      authenticated: true,
      verified: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    },
  };
};

export const forgotPasswordService = async ({ email }: ForgotPasswordInput) => {
  const user = await db.findOne<IUser>(User, { email });
  if (!user) throw new NotFoundError(AUTH_MESSAGES.ERROR.EMAIL_NOT_FOUND);
  await sendPasswordResetCode(user._id as Types.ObjectId, email);
};

export const resetPasswordService = async ({ email, code, password }: ResetPasswordInput) => {
  const user = await db.findOne<IUser>(User, { email }, '_id email');
  if (!user) throw new NotFoundError(AUTH_MESSAGES.ERROR.EMAIL_NOT_FOUND);

  const verification = await EmailVerification.findOne({
    userId: user._id,
    email,
    code,
    type: 'password-reset',
  });

  if (!verification) throw new UnauthorizedError('Invalid or expired reset code');

  const hashed = await hashPassword(password);
  await Promise.all([
    db.updateOne<IUser>(User, user._id as any, { password: hashed }),
    EmailVerification.deleteOne({ _id: verification._id }),
  ]);
};

export const verifyEmailService = async ({ token }: VerifyEmailInput) => {
  const payload = verifyToken(token);
  await db.updateOne<IUser>(User, payload.id, { isEmailVerified: true });
};

export const logoutService = async (token: string, userId: string) => {
  try {
    // Verify the token to get expiration time
    verifyToken(token);
    return { success: true, message: 'Token successfully invalidated' };
  } catch (error) {
    return { success: true, message: 'Token invalidated (fallback)' };
  }
};
