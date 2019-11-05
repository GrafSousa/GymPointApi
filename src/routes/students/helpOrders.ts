import { Router } from 'express';

import HelpOrderController from '../../app/controllers/HelpOrderController';

const studentHelpOrderRoutes = Router();

studentHelpOrderRoutes
  .route('/:id/help-orders')
  .get(HelpOrderController.index)
  .post(HelpOrderController.store);

export { studentHelpOrderRoutes };
