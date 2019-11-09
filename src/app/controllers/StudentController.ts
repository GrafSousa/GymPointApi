import { Request, Response } from 'express';
import * as Yup from 'yup';

import { i18n } from '../../i18n';
import { Student } from '../models/Student';
import { BadRequestApiException, HttpApiException } from '../errors/index';
import { StudentService } from '../services/StudentService';
import StudentServiceImpl from '../services/StudentServiceImpl';

class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = StudentServiceImpl;
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      await this.validateRequest(req);
      await this.studentService.existsStudentByEmail(req.body.email);

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
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      await this.validateRequest(req);
      const { id } = req.params;

      const student = await this.studentService.findStudentOrThrow(id);

      await this.studentService.isTheSameEmail(req.body.email, student.email);

      await student.update(req.body);

      return res.json(student);
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  private async validateRequest(req: Request): Promise<void> {
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

const instance = new StudentController();
['store', 'update'].forEach(method => {
  if (instance[method]) {
    instance[method] = instance[method].bind(instance);
  }
});

export { instance as studentController };
