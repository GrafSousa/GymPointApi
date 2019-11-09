import { Router } from 'express';

import { enrollmentController } from '../../app/controllers/EnrollmentController';

const enrollmentRoutes = Router();

enrollmentRoutes
  .route('')
  .get(enrollmentController.index)
  .post(enrollmentController.store);

enrollmentRoutes
  .route('/:id')
  .delete(enrollmentController.delete)
  .put(enrollmentController.update);

export { enrollmentRoutes };
