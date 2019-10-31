import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plan', PlanController.index);
routes.post('/plan', PlanController.store);
routes.delete('/plan/:id', PlanController.delete);
routes.put('/plan/:id', PlanController.update);

export default routes;
