import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';

import { Student } from '../app/models/Student';
import { User } from '../app/models/User';
import { Plan } from '../app/models/Plan';
import { Enrollment } from '../app/models/Enrollment';

const models = [User, Student, Plan, Enrollment];

class Database {
  private connection: Sequelize;

  constructor() {
    this.init();
    this.mongo();
  }

  private init(): void {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.initModel(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo(): void {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
