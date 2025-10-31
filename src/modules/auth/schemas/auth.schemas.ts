import { VALIDATION_MESSAGES } from '../../../constants';
import { trimAfter } from '../../../middleware';
import { z } from 'zod';

export const loginSchema = z.object({
  email: trimAfter(z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL)),
  password: trimAfter(z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN)),
});

export const registerSchema = z.object({
  name: trimAfter(z.string().min(2, VALIDATION_MESSAGES.NAME_MIN)),
  lastname: trimAfter(z.string().min(2, 'Last name is required')),
  entityName: trimAfter(z.string().min(2, 'Entity name is required')),
  jobTitle: trimAfter(z.string().min(2, 'Job title is required')),
  telephone: trimAfter(z.string().min(6, 'Telephone is required')),
  email: trimAfter(z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL)),
  password: trimAfter(z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN)),
  entityType: z.enum([
    'academia',
    'business',
    'government',
    'grantmaker',
    'funder',
    'intermediary',
    'nonprofit',
  ]),
});

export const authCheckSchema = z.object({}).strict();

export const forgotPasswordSchema = z.object({
  email: trimAfter(z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL)),
});

export const resetPasswordSchema = z.object({
  password: trimAfter(z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN)),
});

export const verifyEmailSchema = z.object({
  token: trimAfter(z.string().min(1, VALIDATION_MESSAGES.REQUIRED)),
});

export const resendVerificationSchema = z.object({
  email: trimAfter(z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL)),
});
