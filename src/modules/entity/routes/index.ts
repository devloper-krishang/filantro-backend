import { authenticate } from '@/middleware';
import { Router } from 'express';
import {
  createEntity,
  updateEntity,
  getEntity,
  claimEntity,
} from '../controllers/entity.controller';
import { validateSchema } from '../../../middleware';
import {
  createEntitySchema,
  updateEntitySchema,
  claimEntitySchema,
} from '../schemas/entity.schemas';

const router = Router();

router.get('/:id/onboarding', authenticate, getOnboarding);
router.patch('/:id/onboarding', authenticate, updateOnboarding);
router.post('/:id/upload', authenticate, upload.single('file'), uploadImage);

export default router;
