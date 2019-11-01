import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import { User } from '../models/User';
import { i18n } from '../../i18n';

class SessionControler {
  public async store(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(404).json({ error: `${i18n.__('validation.fail')}` });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: `${i18n.__('user.notFound')}` });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: `${i18n.__('password.notMatch')}` });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionControler();
