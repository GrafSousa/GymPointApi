import { Request, Response } from 'express';
import * as Yup from 'yup';

import { Plan } from '../models/Plan';
import { i18n } from '../../i18n';

import { BadRequestApiException } from '../errors/index';
import { getPlanService } from './EnrollmentController';

class PlanController {
  public async index(req: Request, res: Response): Promise<Response> {
    const plans = await getPlanService().findPlans();
    return res.json(plans);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    this.validateRequest(req);

    await getPlanService().existsPlanByTitle(req.body.title);

    const { title, duration, price } = await Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    this.validateRequest(req);

    const plan = await getPlanService().findPlanOrThrow(req.params.id);
    await getPlanService().existsPlanByTitle(req.body.title);

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const plan = await getPlanService().findPlanOrThrow(req.params.id);

    plan.excluded = true;

    await plan.save();

    return res.json({ message: `${i18n.__('plan.deleted')}` });
  }

  async validateRequest(req: Request): Promise<void> {
    const schema = this.createSchema();

    if (!(await schema.isValid(req.body))) {
      throw new BadRequestApiException(`${i18n.__('validation.fail')}`);
    }
  }

  createSchema() {
    return Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .min(1)
        .max(12),
      price: Yup.number(),
    });
  }
}

export default new PlanController();
