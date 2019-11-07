/* eslint-disable @typescript-eslint/camelcase */
import { Student } from '../models/Student';

interface StudentService {
  findStudentOrThrow(student_id: string): Promise<Student>;
  existsStudentByEmail(email: string): Promise<void>;
  existsStudent(student_id: string): Promise<void>;
  isTheSameEmail(reqEmail: string, studentEmail: string): Promise<void>;
}

export { StudentService };
