import { Router } from 'express';

import { planController } from '../../app/controllers/PlanController';

const planRoutes = Router();

planRoutes
  .route('')
  .get(planController.index)
  .post(planController.store);

planRoutes
  .route('/:id')
  .delete(planController.delete)
  .put(planController.update);

export { planRoutes };
