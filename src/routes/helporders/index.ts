import { Router } from 'express';

import HelpOrderAnswerController from '../../app/controllers/HelpOrderAnswerController';

const helpOrderRoutes = Router();

helpOrderRoutes.route('/:id/answer').post(HelpOrderAnswerController.store);

export { helpOrderRoutes };
