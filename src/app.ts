import 'dotenv/config';

import express, {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from 'express';
import Youch from 'youch';
import * as Sentry from '@sentry/node';

import { i18n } from './i18n';
import 'express-async-errors';
import { routes } from './routes/index';
import sentryConfig from './config/sentry';

import './database';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.i18n();
    this.exceptionHandler();
  }

  private middlewares(): void {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  private i18n(): void {
    this.server.use(i18n.init);
  }

  private exceptionHandler(): void {
    this.server.use(
      async (
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (process.env.NODE_ENV === 'development') {
          const errors = await new Youch(err, req).toJSON();

          return res.status(500).json(errors);
        }

        return res.status(500).json({ error: 'Internal server error' });
      }
    );
  }
}

export default new App().server;
