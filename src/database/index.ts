import { Sequelize } from 'sequelize';

import databaseConfig from '../config/database';

import Student from '../app/models/Student';
import User from '../app/models/User';
import Plan from '../app/models/Plan';

const models = [User, Student, Plan];

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
