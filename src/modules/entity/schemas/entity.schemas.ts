import { z } from 'zod';
import { trimAfter } from '../../../middleware';
import { ENTITY_TYPES } from '../utils/constants';

export const createEntitySchema = z.object({
  name: trimAfter(z.string().min(2)),
  slug: trimAfter(z.string().min(2)),
  entityType: z.enum(ENTITY_TYPES),
  description: trimAfter(z.string()).optional(),
  website: trimAfter(z.string().url()).optional(),
  contactEmail: trimAfter(z.string().email()).optional(),
  country: trimAfter(z.string()).optional(),
  region: trimAfter(z.string()).optional(),
  city: trimAfter(z.string()).optional(),
});

export const updateEntitySchema = createEntitySchema.partial();

export const claimEntitySchema = z.object({
  entityId: trimAfter(z.string().min(1)),
  message: trimAfter(z.string()).optional(),
});
