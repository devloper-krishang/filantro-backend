import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/user/routes';
import entityRoutes from '../modules/entity/routes';
// import auditRoutes from '@/modules/audit/routes/audit.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/entity', entityRoutes);
// apiRouter.use('/audit', auditRoutes);

export default apiRouter;
