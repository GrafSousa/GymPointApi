import { Router } from 'express';

import StudentController from '../../app/controllers/StudentController';

const studentRoutes = Router();

studentRoutes.route('').post(StudentController.store);
studentRoutes.route('/:id').put(StudentController.update);

export { studentRoutes };
