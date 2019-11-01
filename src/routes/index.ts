import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';

import authMiddleware from '../app/middlewares/auth';

import planRoutes from './plan/index';
import studentRoutes from './students/index';

const routes = Router();
const url = '/api';

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.use(`${url}/students`, studentRoutes);
routes.use(`${url}/plan`, planRoutes);

export default routes;
