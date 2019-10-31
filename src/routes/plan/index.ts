import { Router } from 'express';

import PlanController from '../../app/controllers/PlanController';

const planRoutes = Router();

planRoutes
  .route('')
  .get(PlanController.index)
  .post(PlanController.store);

planRoutes
  .route('/:id')
  .delete(PlanController.delete)
  .put(PlanController.update);

export default planRoutes;
