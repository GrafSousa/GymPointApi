import { CheckinInterface } from '../schemas/Chekin';

interface CheckinService {
  findByStudentId(studentId: string): Promise<CheckinInterface[]>;
  existsCheckinOnActualDate(studentId: string): Promise<void>;
  isStudentReachLimitOfCheckins(studentId: string): Promise<void>;
}

export { CheckinService };
