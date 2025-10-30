import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  logout,
  authCheck,
} from '../controllers/auth.controller';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  authCheckSchema,
} from '../schemas/auth.schemas';
import { authenticate, validateSchema } from '@/middleware';

const router = Router();

/**
 * Login user
 * @auth public
 */
router.post('/login', validateSchema(loginSchema), login);

/**
 * Register user
 * @auth public
 */
router.post('/register', validateSchema(registerSchema), register);

router.get('/me', authenticate, authCheck);

/**
 * Send password reset link
 * @auth public
 */
router.post('/forgot-password', validateSchema(forgotPasswordSchema), forgotPassword);

/**
 * Reset password
 * @auth public
 */
router.post('/reset-password/:token', validateSchema(resetPasswordSchema), resetPassword);

/**
 * Verify email
 * @auth public
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * Resend email verification
 * @auth public
 */
router.post('/resend-verification', validateSchema(resendVerificationSchema), resendVerification);

/**
 * Logout user - invalidate token
 * @auth protected
 */
router.post('/logout', logout);

export default router;
