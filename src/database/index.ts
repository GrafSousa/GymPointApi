import { Sequelize } from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';
import Student from '../app/models/Student';

const models = [User, Student];

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
