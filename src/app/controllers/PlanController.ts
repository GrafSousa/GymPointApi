import { Request, Response } from 'express';
import * as Yup from 'yup';

import { Plan } from '../models/Plan';
import { i18n } from '../../i18n';

class PlanController {
  public async index(req: Request, res: Response): Promise<Response> {
    const plans = await Plan.findAll({
      where: { excluded: false },
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json(plans);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .min(1)
        .max(12),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `${i18n.__('validation.fail')}` });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title, excluded: false },
    });

    if (planExists) {
      return res
        .status(409)
        .json({ error: `${i18n.__('plan.already.exists')}` });
    }

    const { title, duration, price } = await Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .min(1)
        .max(12),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `${i18n.__('validation.fail')}` });
    }

    const plan = await Plan.findOne({
      where: { id: req.params.id, excluded: false },
    });

    if (!plan) {
      return res.status(404).json({ error: `${i18n.__('plan.notFound')}` });
    }

    const existPlan = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (existPlan) {
      return res
        .status(409)
        .json({ error: `${i18n.__('plan.already.exists')}` });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const plan: Plan = await Plan.findOne({
      where: { id: req.params.id, excluded: false },
    });

    if (!plan) {
      return res.status(404).json({ error: `${i18n.__('plan.notFound')}` });
    }

    plan.excluded = true;

    await plan.save();

    return res.json({ message: `${i18n.__('plan.deleted')}` });
  }
}

export default new PlanController();
