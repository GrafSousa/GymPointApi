/* eslint-disable @typescript-eslint/camelcase */
import { Student } from '../models/Student';

interface StudentService {
  findStudentOrThrow(student_id: string): Promise<Student>;
  existsStudent(student_id: string): Promise<void>;
}

export { StudentService };
