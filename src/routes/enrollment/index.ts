import { Router } from 'express';

import EnrollmentController from '../../app/controllers/EnrollmentController';

const enrollmentRoutes = Router();

enrollmentRoutes
  .route('')
  .get(EnrollmentController.index.bind(EnrollmentController))
  .post(EnrollmentController.store.bind(EnrollmentController));

enrollmentRoutes
  .route('/:id')
  .delete(EnrollmentController.delete.bind(EnrollmentController))
  .put(EnrollmentController.update.bind(EnrollmentController));

export { enrollmentRoutes };
