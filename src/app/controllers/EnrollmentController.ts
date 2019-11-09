/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express';
import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, startOfDay } from 'date-fns';

import Queue from '../../lib/Queue';
import EnrollMail from '../jobs/EnrollMail';
import { BaseController } from './BaseController';
import { Enrollment } from '../models/Enrollment';

import { i18n } from '../../i18n';
import { HttpApiException, BadRequestApiException } from '../errors/index';

import PlanServiceImpl from '../services/PlanServiceImpl';
import StudentServiceImpl from '../services/StudentServiceImpl';
import EnrollmentServiceImpl from '../services/EnrollmentServiceImpl';
import { PlanService } from '../services/PlanService';
import { StudentService } from '../services/StudentService';
import { EnrollmentService } from '../services/EnrollmentService';

class EnrollmentController implements BaseController {
  private planService: PlanService;

  private studentService: StudentService;

  private enrollmentService: EnrollmentService;

  constructor() {
    this.planService = PlanServiceImpl;
    this.studentService = StudentServiceImpl;
    this.enrollmentService = EnrollmentServiceImpl;
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query;
    const enrollments = await Enrollment.findAllNotCanceled(page);
    return res.json(enrollments);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { plan_id, student_id, start_date } = req.body;
    try {
      await this.verifyRequest(req);
      const startDay = this.calculateStardDay(start_date);

      if (isBefore(startDay, startOfDay(new Date()))) {
        return res
          .status(400)
          .json({ error: `${i18n.__('enrollment.pastDates')}` });
      }

      const plan = await this.planService.findPlanOrThrow(plan_id);
      const student = await this.studentService.findStudentOrThrow(student_id);

      const end_date = this.calculateEndDate(start_date, plan.duration);

      await this.enrollmentService.isEnrollmentOverlapping(startDay, end_date);

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
    const { plan_id, student_id, start_date } = req.body;
    try {
      await this.verifyRequest(req);

      const enrollment = await this.enrollmentService.findEnrollmentOrThrow(
        req.params.id
      );

      await this.studentService.notExistsStudent(student_id);

      this.isStudentOfThisEnrollment(
        enrollment.student_id,
        req.body.student_id
      );

      const plan = await this.planService.findPlanOrThrow(plan_id);
      const startDay = this.calculateStardDay(start_date);
      const end_date = this.calculateEndDate(start_date, plan.duration);

      await this.enrollmentService.isEnrollmentOverlapping(startDay, end_date);
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
    try {
      const enrollment = await Enrollment.findOneNotCanceled(req.params.id);

      this.isStudentOfThisEnrollment(
        enrollment.student_id,
        req.body.student_id
      );

      this.isPlanOfThisEnrollment(enrollment.plan_id, req.body.plan_id);

      await Enrollment.deleteEnrollment(enrollment);

      return res.json(enrollment);
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
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

const instance = new EnrollmentController();
['index', 'store', 'delete', 'update'].forEach(method => {
  if (instance[method]) {
    instance[method] = instance[method].bind(instance);
  }
});

export { instance as enrollmentController };
