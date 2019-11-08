import { Router } from 'express';

import StudentController from '../../app/controllers/StudentController';

const studentRoutes = Router();

studentRoutes.route('').post(StudentController.store.bind(StudentController));
studentRoutes
  .route('/:id')
  .put(StudentController.update.bind(StudentController));

export { studentRoutes };
