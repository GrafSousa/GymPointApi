import { Sequelize } from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [User];

class Database {
  private connection: Sequelize;

  constructor() {
    this.init();
  }

  private init(): void {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.initModel(this.connection));
  }
}

export default new Database();
