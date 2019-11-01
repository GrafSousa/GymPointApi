import express from 'express';

import { i18n } from './i18n';
import { routes } from './routes/index';

import './database';

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.i18n();
  }

  private middlewares(): void {
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routes);
  }

  private i18n(): void {
    this.server.use(i18n.init);
  }
}

export default new App().server;
