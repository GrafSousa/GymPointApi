import { Request, Response } from 'express';

import Checkin from '../schemas/Chekin';
import { HttpApiException } from '../errors/index';
import { StudentService } from '../services/StudentService';
import StudentServiceImpl from '../services/StudentServiceImpl';
import { CheckinService } from '../services/CheckinService';
import CheckinServiceImpl from '../services/CheckinServiceImpl';

class CheckinController {
  private checkinService: CheckinService;

  private studentService: StudentService;

  constructor() {
    this.studentService = StudentServiceImpl;
    this.checkinService = CheckinServiceImpl;
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.studentService.findStudentOrThrow(id);

      const checkins = await this.checkinService.findByStudentId(id);

      return res.json(checkins);
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.studentService.findStudentOrThrow(id);

      await this.checkinService.existsCheckinOnActualDate(id);

      await this.checkinService.isStudentReachLimitOfCheckins(id);

      const checkin = await Checkin.create({
        student: id,
      });

      return res.json(checkin);
    } catch (e) {
      if (e instanceof HttpApiException) {
        return res.status(e.code).json(e.message);
      }
      return res.json(e.message);
    }
  }
}

const instance = new CheckinController();
['index', 'store'].forEach(method => {
  if (instance[method]) {
    instance[method] = instance[method].bind(instance);
  }
});

export { instance as checkinController };
