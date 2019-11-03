import { Router } from 'express';

import EnrollmentController from '../../app/controllers/EnrollmentController';

const enrollmentRoutes = Router();

enrollmentRoutes
  .route('')
  .get(EnrollmentController.index)
  .post(EnrollmentController.store);

enrollmentRoutes
  .route('/:id')
  .delete(EnrollmentController.delete)
  .put(EnrollmentController.update);

export { enrollmentRoutes };
