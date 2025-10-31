import { trimAfter } from '../../../middleware';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: trimAfter(z.string().min(2)),
  email: trimAfter(z.string().email()),
  password: trimAfter(z.string().min(6)),
});

export const updateUserSchema = z.object({
  name: trimAfter(z.string().min(2)).optional(),
  email: trimAfter(z.string().email()).optional(),
  role: z.enum(['user', 'admin']).optional(),
});
