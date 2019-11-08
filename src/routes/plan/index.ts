import { Router } from 'express';

import PlanController from '../../app/controllers/PlanController';

const planRoutes = Router();

planRoutes
  .route('')
  .get(PlanController.index.bind(PlanController))
  .post(PlanController.store.bind(PlanController));

planRoutes
  .route('/:id')
  .delete(PlanController.delete.bind(PlanController))
  .put(PlanController.update.bind(PlanController));

export { planRoutes };
