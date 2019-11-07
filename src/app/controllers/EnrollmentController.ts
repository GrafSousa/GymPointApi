/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express';
import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, startOfDay } from 'date-fns';

import Queue from '../../lib/Queue';
import EnrollMail from '../jobs/EnrollMail';
import { Enrollment } from '../models/Enrollment';

import { i18n } from '../../i18n';
import { HttpApiException, BadRequestApiException } from '../errors/index';

import PlanServiceImpl from '../services/PlanServiceImpl';
import StudentServiceImpl from '../services/StudentServiceImpl';
import EnrollmentServiceImpl from '../services/EnrollmentServiceImpl';

function getPlanService() {
  return PlanServiceImpl;
}

function getStudentService() {
  return StudentServiceImpl;
}

function getEnrollmentService() {
  return EnrollmentServiceImpl;
}

export {
  getPlanService, getStudentService, getEnrollmentService
}

class EnrollmentController {
  async index(req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query;
    const enrollments = await Enrollment.findAllNotCanceled(page);
    return res.json(enrollments);
  }

  async store(req: Request, res: Response): Promise<Response> {
    this.verifyRequest(req);

    const { plan_id, student_id, start_date } = req.body;
    try {
      const startDay = this.calculateStardDay(start_date);

      if (isBefore(startDay, startOfDay(new Date()))) {
        return res
          .status(400)
          .json({ error: `${i18n.__('enrollment.pastDates')}` });
      }

      const plan = await getPlanService().findPlanOrThrow(plan_id);
      const student = await getStudentService().findStudentOrThrow(student_id);

      const end_date = this.calculateEndDate(start_date, plan.duration);

      await getEnrollmentService().isEnrollmentOverlapping(startDay, end_date);

      const price = this.calculatePrice(plan.duration, plan.price);
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
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    this.verifyRequest(req);

    const { plan_id, student_id, start_date } = req.body;
    try {
      await getStudentService().existsStudent(student_id);

      const enrollment = await getEnrollmentService().findEnrollmentOrThrow(
        req.body.id
      );

      this.isStudentOfThisEnrollment(
        enrollment.student_id,
        req.body.student_id
      );

      const plan = await getPlanService().findPlanOrThrow(plan_id);
      const startDay = this.calculateStardDay(start_date);
      const end_date = this.calculateEndDate(start_date, plan.duration);

      await getEnrollmentService().isEnrollmentOverlapping(startDay, end_date);
      await Enrollment.deleteEnrollment(enrollment);

      const price = this.calculatePrice(plan.duration, plan.price);
      const newEnrollment = await Enrollment.create({
        plan_id,
        student_id,
        start_date,
        end_date,
        price,
      });

      return res.json(newEnrollment);
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const enrollment = await Enrollment.findOneNotCanceled(req.params.id);

    this.isStudentOfThisEnrollment(enrollment.student_id, req.body.student_id);

    await Enrollment.deleteEnrollment(enrollment);

    return res.json(enrollment);
  }

  async verifyRequest(req: Request): Promise<void> {
    const schema = this.createSchema();

    if (!(await schema.isValid(req.body))) {
      throw new BadRequestApiException(`${i18n.__('validation.fail')}`);
    }
  }

  createSchema() {
    return Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
  }

  calculateStardDay(start_date: string): Date {
    return startOfDay(new Date(start_date));
  }

  calculateEndDate(start_date: string, duration: number): Date {
    return addMonths(parseISO(start_date), duration);
  }

  calculatePrice(duration: number, price: number): number {
    return duration * price;
  }

  isStudentOfThisEnrollment(
    studentEnrollmentId: number,
    reqStudentId: number
  ): void {
    if (studentEnrollmentId !== reqStudentId) {
      throw new BadRequestApiException(
        `${i18n.__('enrollment.invalidStudent')}`
      );
    }
  }

  isPlanOfThisEnrollment(planEnrollmentId: number, reqPlanId: number): void {
    if (planEnrollmentId !== reqPlanId) {
      throw new BadRequestApiException(`${i18n.__('enrollment.invalidPlan')}`);
    }
  }
}

export default new EnrollmentController();
