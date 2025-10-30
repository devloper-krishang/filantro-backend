import { Router } from 'express';
import {
  createEntity,
  updateEntity,
  getEntity,
  claimEntity,
} from '../controllers/entity.controller';
import { validateSchema } from '@/middleware';
import {
  createEntitySchema,
  updateEntitySchema,
  claimEntitySchema,
} from '../schemas/entity.schemas';

const router = Router();

router.post('/', validateSchema(createEntitySchema), createEntity);
router.patch('/:id', validateSchema(updateEntitySchema), updateEntity);
router.get('/:id', getEntity);
router.post('/claim', validateSchema(claimEntitySchema), claimEntity);

export default router;
