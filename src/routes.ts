import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.post('/students', StudentController.store);

export default routes;
