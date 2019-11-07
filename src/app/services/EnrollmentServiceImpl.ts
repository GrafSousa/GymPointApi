/* eslint-disable @typescript-eslint/camelcase */
import { Op } from 'sequelize';

import { Enrollment } from '../models/Enrollment';
import { EnrollmentService } from './EnrollmentService';

import { i18n } from '../../i18n';

import { ConflictApiException, NotFoundApiException } from '../errors/index';

class EnrollmentServiceImpl implements EnrollmentService {
  async isEnrollmentOverlapping(
    start_date: Date,
    end_date: Date
  ): Promise<void> {
    const numberEnrollments = await this.countEnrollments(start_date, end_date);
    if (numberEnrollments > 0) {
      throw new ConflictApiException(`${i18n.__('enrollment.overlapping')}`);
    }
  }

  private async countEnrollments(
    start_date: Date,
    end_date: Date
  ): Promise<number> {
    const existsEnrollment = await Enrollment.count({
      where: {
        canceled_at: null,
        [Op.and]: {
          start_date: {
            [Op.lte]: end_date,
          },
          end_date: {
            [Op.gte]: start_date,
          },
        },
      },
    });

    return existsEnrollment;
  }

  async findEnrollmentOrThrow(enrollment_id: string): Promise<Enrollment> {
    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollment_id,
        canceled_at: null,
      },
    });

    if (!enrollment) {
      throw new NotFoundApiException(`${i18n.__('enrollment.notFound')}`);
    }
    return enrollment;
  }
}

export default new EnrollmentServiceImpl();
