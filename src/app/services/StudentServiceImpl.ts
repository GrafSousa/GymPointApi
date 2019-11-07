/* eslint-disable @typescript-eslint/camelcase */
import { StudentService } from './StudentService';
import { Student } from '../models/Student';
import { NotFoundApiException, ConflictApiException } from '../errors/index';

import { i18n } from '../../i18n';

class StudentServiceImpl implements StudentService {
  async findStudentOrThrow(student_id: string): Promise<Student> {
    const student = await Student.findByPk(student_id);

    if (!student) {
      throw new NotFoundApiException(`${i18n.__('student.notFound')}`);
    }

    return student;
  }

  async existsStudentByEmail(email: string): Promise<void> {
    const existsStudent = await Student.findStudentByEmail(email);

    if (!existsStudent) {
      throw new ConflictApiException(`${i18n.__('student.already.exists')}`);
    }
  }

  async existsStudent(student_id: string): Promise<void> {
    const existsStudent = await Student.findByPk(student_id);

    if (!existsStudent) {
      throw new ConflictApiException(`${i18n.__('student.already.exists')}`);
    }
  }

  async isTheSameEmail(reqEmail: string, studentEmail: string): Promise<void> {
    if (reqEmail !== studentEmail) {
      await this.existsStudentByEmail(reqEmail);
    }
  }
}

export default new StudentServiceImpl();
