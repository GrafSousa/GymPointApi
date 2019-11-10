import { Router } from 'express';

import { checkinController } from '../../app/controllers/CheckinController';

const checkinRoutes = Router();

checkinRoutes
  .route('/:id/checkins')
  .get(checkinController.index)
  .post(checkinController.store);

export { checkinRoutes };
