import { Router } from 'express';
import { resendEmail, verifyCode } from '../controllers/user.controller';
import { authenticate } from '@/middleware';

const router = Router();

router.get('/resend-email', authenticate, resendEmail);
router.post('/verify-code', authenticate, verifyCode);

export default router;
