import { Router } from 'express';

import CheckinController from '../../app/controllers/CheckinController';

const checkinRoutes = Router();

checkinRoutes.route('/:id/checkins').get(CheckinController.index);

export { checkinRoutes };
