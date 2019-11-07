/* eslint-disable @typescript-eslint/camelcase */
import { Enrollment } from '../models/Enrollment';

interface EnrollmentService {
  isEnrollmentOverlapping(start_date: Date, end_date: Date): Promise<void>;
  findEnrollmentOrThrow(enrollment_id: string): Promise<Enrollment>;
}

export { EnrollmentService };
