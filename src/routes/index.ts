import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';

import authMiddleware from '../app/middlewares/auth';

import planRoutes from './plan/index';
import studentRoutes from './students/index';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.use('/students', studentRoutes);
routes.use('/plan', planRoutes);

export default routes;
