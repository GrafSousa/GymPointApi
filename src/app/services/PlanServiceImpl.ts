/* eslint-disable @typescript-eslint/camelcase */
import { PlanService } from './PlanService';
import { Plan } from '../models/Plan';
import { NotFoundApiException } from '../errors/index';

import { i18n } from '../../i18n';

class PlanServiceImpl implements PlanService {
  async findPlanOrThrow(plan_id: string): Promise<Plan> {
    const plan = await Plan.findOne({
      where: { id: plan_id, excluded: false },
    });
    if (!plan) {
      throw new NotFoundApiException(`${i18n.__('plan.notFound')}`);
    }
    return plan;
  }
}

export default new PlanServiceImpl();
