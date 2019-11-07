/* eslint-disable @typescript-eslint/camelcase */
import { Plan } from '../models/Plan';

interface PlanService {
  findPlans(): Promise<Plan[]>;
  findPlanOrThrow(plan_id: string): Promise<Plan>;
  existsPlanByTitle(title: string): Promise<void>;
}

export { PlanService };
