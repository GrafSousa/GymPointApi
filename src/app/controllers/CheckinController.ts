import { Request, Response } from 'express';

import Checkin from '../schemas/Chekin';

class CheckinController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const checkins = await Checkin.find({
      student: id,
    }).sort({ createdAt: 'desc' });
    return res.json(checkins);
  }
}

export default new CheckinController();
