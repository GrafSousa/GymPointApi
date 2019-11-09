import { Request, Response } from 'express';
import * as Yup from 'yup';

import { Plan } from '../models/Plan';
import { i18n } from '../../i18n';

import { BaseController } from './BaseController';
import { BadRequestApiException, HttpApiException } from '../errors/index';
import { PlanService } from '../services/PlanService';
import PlanServiceImpl from '../services/PlanServiceImpl';

class PlanController implements BaseController {
  private planService: PlanService;

  constructor() {
    this.planService = PlanServiceImpl;
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const plans = await this.planService.findPlans();
    return res.json(plans);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      await this.validateRequest(req);

      await this.planService.existsPlanByTitle(req.body.title);

      const { title, duration, price } = await Plan.create(req.body);

      return res.json({
        title,
        duration,
        price,
      });
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      await this.validateRequest(req);

      const plan = await this.planService.findPlanOrThrow(req.params.id);
      await this.planService.existsPlanByTitle(req.body.title);

      const { id, title, duration, price } = await plan.update(req.body);

      return res.json({
        id,
        title,
        duration,
        price,
      });
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const plan = await this.planService.findPlanOrThrow(req.params.id);

      plan.excluded = true;

      await plan.save();

      return res.json({ message: `${i18n.__('plan.deleted')}` });
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  async validateRequest(req: Request): Promise<void> {
    const schema = this.createSchema();

    if (!(await schema.isValid(req.body))) {
      throw new BadRequestApiException(`${i18n.__('validation.fail')}`);
    }
  }

  createSchema() {
    return Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .min(1)
        .max(12),
      price: Yup.number().required(),
    });
  }
}

const instance = new PlanController();
['index', 'store', 'delete', 'update'].forEach(method => {
  if (instance[method]) {
    instance[method] = instance[method].bind(instance);
  }
});

export { instance as planController };
