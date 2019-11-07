import { Request, Response } from 'express';
import * as Yup from 'yup';

import { i18n } from '../../i18n';
import { Student } from '../models/Student';
import { BadRequestApiException } from '../errors/index';

import { getStudentService } from './EnrollmentController';

class StudentController {
  public async store(req: Request, res: Response): Promise<Response> {
    this.validateRequest(req);

    await getStudentService().existsStudentByEmail(req.body.email);

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

  public async update(req: Request, res: Response): Promise<Response> {
    this.validateRequest(req);

    const { id } = req.params;

    const student = await getStudentService().findStudentOrThrow(id);

    await getStudentService().isTheSameEmail(req.body.email, student.email);

    await student.update(req.body);

    return res.json(student);
  }

  async validateRequest(req: Request): Promise<void> {
    const schema = this.createSchema();

    if (!(await schema.isValid(req.body))) {
      throw new BadRequestApiException(`${i18n.__('validation.fail')}`);
    }
  }

  createSchema() {
    return Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
  }
}

export default new StudentController();
