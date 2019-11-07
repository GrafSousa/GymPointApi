/* eslint-disable @typescript-eslint/camelcase */
import { StudentService } from './StudentService';
import { Student } from '../models/Student';
import { NotFoundApiException } from '../errors/index';

import { i18n } from '../../i18n';

class StudentServiceImpl implements StudentService {
  async findStudentOrThrow(student_id: string): Promise<Student> {
    const student = await Student.findByPk(student_id);

    if (!student) {
      throw new NotFoundApiException(`${i18n.__('student.notFound')}`);
    }

    return student;
  }
  
  async existsStudent(student_id: string): Promise<void> {
    const existsStudent = await Student.findByPk(student_id);

    if (!existsStudent) {
      throw new NotFoundApiException(`${i18n.__('student.notFound')}`);
    }
  }
}

export default new StudentServiceImpl();
