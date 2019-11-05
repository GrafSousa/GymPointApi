import * as Yup from 'yup';
import { Request, Response } from 'express';

import HelpOrder from '../schemas/HelpOrder';

import { i18n } from '../../i18n';

class HelpOrderController {
  public async index(req: Request, res: Response): Promise<Response> {
    const helpOrders = await HelpOrder.find({ answer_at: null }).sort({
      createdAt: 'desc',
    });

    return res.json(helpOrders);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `${i18n.__('validation.fail')}` });
    }

    const { question } = req.body;
    const { id } = req.params;

    const helpOrder = await HelpOrder.create({
      student: id,
      question,
    });

    const { _id } = helpOrder;

    return res.json({ _id, question });
  }
}

export default new HelpOrderController();
