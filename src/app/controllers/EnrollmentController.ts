/* eslint-disable @typescript-eslint/camelcase */
import * as Yup from 'yup';
import { Request, Response } from 'express';
import {
  parseISO,
  isBefore,
  addMonths,
  startOfDay,
  areIntervalsOverlapping,
} from 'date-fns';

import { Plan } from '../models/Plan';
import { Student } from '../models/Student';
import { Enrollment } from '../models/Enrollment';

import EnrollMail from '../jobs/EnrollMail';
import Queue from '../../lib/Queue';

import { i18n } from '../../i18n';

class EnrollmentController {
  async index(req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query;
    const enrollments = await Enrollment.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    return res.json(enrollments);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `${i18n.__('validation.fail')}` });
    }

    const { plan_id, student_id, start_date } = req.body;

    const startDay = startOfDay(new Date(start_date));

    const plan = await Plan.findOne({
      where: { id: plan_id, excluded: false },
    });

    if (!plan) {
      return res.status(404).json({ error: `${i18n.__('plan.notFound')}` });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: `${i18n.__('student.notFound')}` });
    }

    if (isBefore(startDay, startOfDay(new Date()))) {
      return res
        .status(400)
        .json({ error: `${i18n.__('enrollment.pastDates')}` });
    }

    const end_date = addMonths(parseISO(startDay.toISOString()), plan.duration);
    const price = plan.duration * plan.price;

    const lastEnrollment = await Enrollment.findOne({
      limit: 1,
      where: {
        canceled_at: null,
        student_id,
      },
      order: [['start_date', 'DESC']],
    });

    if (
      lastEnrollment &&
      areIntervalsOverlapping(
        {
          start: startOfDay(lastEnrollment.start_date),
          end: startOfDay(lastEnrollment.end_date),
        },
        { start: startDay, end: end_date }
      )
    ) {
      return res
        .status(409)
        .json({ error: `${i18n.__('enrollment.overlapping')}` });
    }

    const enrollment = await Enrollment.create({
      plan_id,
      student_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(EnrollMail.key, {
      student,
      enrollment,
    });

    return res.json(enrollment);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `${i18n.__('validation.fail')}` });
    }

    const { plan_id, student_id, start_date } = req.body;

    const startDay = startOfDay(new Date(start_date));

    const plan = await Plan.findOne({
      where: { id: plan_id, excluded: false },
    });

    if (!plan) {
      return res.status(404).json({ error: `${i18n.__('plan.notFound')}` });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({ error: `${i18n.__('student.notFound')}` });
    }

    const enrollment = await Enrollment.findOne({
      where: {
        id: req.params.id,
        canceled_at: null,
      },
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: `${i18n.__('enrollment.notFound')}` });
    }

    if (enrollment.student_id !== req.body.student_id) {
      return res
        .status(400)
        .json({ error: `${i18n.__('enrollment.invalidStudent')}` });
    }

    const lastEnrollment = await Enrollment.findOne({
      limit: 1,
      where: {
        canceled_at: null,
        student_id,
      },
      order: [['start_date', 'DESC']],
    });

    const end_date = addMonths(parseISO(start_date), plan.duration);

    if (
      lastEnrollment &&
      areIntervalsOverlapping(
        {
          start: startOfDay(lastEnrollment.start_date),
          end: startOfDay(lastEnrollment.end_date),
        },
        { start: startDay, end: end_date }
      )
    ) {
      return res
        .status(409)
        .json({ error: `${i18n.__('enrollment.enrollment.overlapping')}` });
    }

    enrollment.canceled_at = new Date();

    await enrollment.save();

    const price = plan.duration * plan.price;

    const newEnrollment = await Enrollment.create({
      plan_id,
      student_id,
      start_date,
      end_date,
      price,
    });

    return res.json(newEnrollment);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const enrollment = await Enrollment.findOne({
      where: {
        id: req.params.id,
        canceled_at: null,
      },
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: `${i18n.__('enrollment.notFound')}` });
    }

    if (enrollment.student_id !== req.body.student_id) {
      return res
        .status(400)
        .json({ error: `${i18n.__('enrollment.invalidStudent')}` });
    }

    if (enrollment.plan_id !== req.body.plan_id) {
      return res
        .status(400)
        .json({ error: `${i18n.__('enrollment.invalidPlan')}` });
    }

    enrollment.canceled_at = new Date();

    await enrollment.save();

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
