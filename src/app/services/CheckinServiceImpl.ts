/* eslint-disable @typescript-eslint/camelcase */
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { i18n } from '../../i18n';
import Checkin, { CheckinInterface } from '../schemas/Chekin';
import { CheckinService } from './CheckinService';
import { ConflictApiException, BadRequestApiException } from '../errors/index';

class CheckinServiceImpl implements CheckinService {
  async findByStudentId(student_id: string): Promise<CheckinInterface[]> {
    const checkins = await Checkin.find({
      student: student_id,
    }).sort({ createdAt: 'desc' });

    return checkins;
  }

  async existsCheckinOnActualDate(student_id: string): Promise<void> {
    const date = startOfDay(new Date());
    const existsCheckinDate = await Checkin.exists({
      student: student_id,
      createdAt: { $gte: startOfDay(date), $lte: endOfDay(date) },
    });

    if (existsCheckinDate) {
      throw new ConflictApiException(`${i18n.__('checkin.conflict')}`);
    }
  }

  async isStudentReachLimitOfCheckins(id: string): Promise<void> {
    const count = await this.countCheckinsBetweenDate(id);
    if (count >= 5) {
      throw new BadRequestApiException(`${i18n.__('checkin.limit.reached')}`);
    }
  }

  private async countCheckinsBetweenDate(id: string): Promise<number> {
    const actualDate = startOfDay(new Date());
    const startDate = subDays(actualDate, 7);
    const count = await Checkin.estimatedDocumentCount()
      .where('student_id')
      .equals(id)
      .where('createdAt')
      .lte(actualDate)
      .where('createdAt')
      .gte(startDate);

    return count;
  }
}

export default new CheckinServiceImpl();
