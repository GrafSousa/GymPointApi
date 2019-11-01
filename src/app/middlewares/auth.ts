import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import { i18n } from '../../i18n';

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: `${i18n.__('token.notProvided')}` });
  }

  const [, token] = authHeader.split(' ');

  try {
    await promisify(jwt.verify)(token, authConfig.secret);

    return next();
  } catch (err) {
    return res.status(401).json({ error: `${i18n.__('token.invalid')}` });
  }
}

export { authMiddleware };
