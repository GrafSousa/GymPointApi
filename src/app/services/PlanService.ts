/* eslint-disable @typescript-eslint/camelcase */
import { Plan } from '../models/Plan';

interface PlanService {
  findPlanOrThrow(plan_id: string): Promise<Plan>;
}

export { PlanService };
