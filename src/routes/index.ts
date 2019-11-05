import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';

import { authMiddleware } from '../app/middlewares/auth';

import { planRoutes } from './plan/index';
import { studentRoutes } from './students/index';
import { studentHelpOrderRoutes } from './students/helpOrders';
import { enrollmentRoutes } from './enrollment/index';
import { checkinRoutes } from './checkin/index';

const routes = Router();
const url = '/api';

routes.post('/sessions', SessionController.store);
routes.use(`${url}/students`, checkinRoutes);
routes.use(`${url}/students`, studentHelpOrderRoutes);

routes.use(authMiddleware);

routes.use(`${url}/students`, studentRoutes);
routes.use(`${url}/plan`, planRoutes);
routes.use(`${url}/enrollment`, enrollmentRoutes);

export { routes };
