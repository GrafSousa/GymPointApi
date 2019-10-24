import { Request, Response } from 'express';

import Student from '../models/Student';

class StudentController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
