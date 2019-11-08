/* eslint-disable @typescript-eslint/camelcase */
import { PlanService } from './PlanService';
import { Plan } from '../models/Plan';
import { NotFoundApiException, ConflictApiException } from '../errors/index';

import { i18n } from '../../i18n';

class PlanServiceImpl implements PlanService {
  findPlans(): Promise<Plan[]> {
    return Plan.findAllNotExcluded();
  }

  async findPlanOrThrow(plan_id: string): Promise<Plan> {
    const plan = await Plan.findOneByIdAndNotCanceled(plan_id);
    if (!plan) {
      throw new NotFoundApiException(`${i18n.__('plan.notFound')}`);
    }
    return plan;
  }

  async existsPlanByTitle(title: string): Promise<void> {
    const planExists = await Plan.findOneByTitleAndNotCanceled(title);

    if (planExists) {
      throw new ConflictApiException(`${i18n.__('plan.already.exists')}`);
    }
  }
}

export default new PlanServiceImpl();
