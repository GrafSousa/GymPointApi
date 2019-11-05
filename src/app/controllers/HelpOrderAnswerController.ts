import * as Yup from 'yup';
import { Request, Response } from 'express';

import { i18n } from '../../i18n';

import HelpOrder from '../schemas/HelpOrder';
import { Student } from '../models/Student';

import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderAnswerController {
  public async store(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `${i18n.__('validation.fail')}` });
    }

    const { id } = req.params;
    const helpOrder = await HelpOrder.findOne({
      _id: id,
      answer_at: null,
    });

    if (!helpOrder) {
      return res
        .status(404)
        .json({ error: `${i18n.__('helpOrder.notFound')}` });
    }

    helpOrder.answer = req.body.answer;
    helpOrder.answer_at = new Date();

    helpOrder.save();

    const student = await Student.findByPk(helpOrder.student);

    if (!student) {
      return res.status(404).json({ error: `${i18n.__('student.notFound')}` });
    }

    await Queue.add(HelpOrderAnswerMail.key, {
      student,
      helpOrder,
    });

    const { name } = student;
    const { _id, question, answer } = helpOrder;

    return res.json({ _id, name, question, answer });
  }
}

export default new HelpOrderAnswerController();
