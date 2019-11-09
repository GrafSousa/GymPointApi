import { Router } from 'express';

import { studentController } from '../../app/controllers/StudentController';

const studentRoutes = Router();

studentRoutes.route('').post(studentController.store);
studentRoutes.route('/:id').put(studentController.update);

export { studentRoutes };
