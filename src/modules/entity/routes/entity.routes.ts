import { authenticate } from '@/middleware';
import { Router } from 'express';
import { getOnboarding, updateOnboarding } from '../controllers/entity.controller';

const router = Router();

router.get('/:id/onboarding',authenticate, getOnboarding);
router.patch('/:id/onboarding', authenticate, updateOnboarding);


export default router;
