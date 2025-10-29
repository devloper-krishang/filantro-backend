import { authenticate } from '@/middleware';
import { Router } from 'express';
import { getOnboarding, updateOnboarding, uploadImage } from '../controllers/entity.controller';
import upload from '@/middleware/upload.middleware';

const router = Router();

router.get('/:id/onboarding', authenticate, getOnboarding);
router.patch('/:id/onboarding', authenticate, updateOnboarding);
router.post('/:id/upload', authenticate, upload.single('file'), uploadImage);

export default router;
