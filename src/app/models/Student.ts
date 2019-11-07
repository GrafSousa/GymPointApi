import sq from 'sequelize';

import Bluebird from 'bluebird';
import { BaseModel } from './BaseModel';

class Student extends BaseModel {
  public id: number;

  public name: string;

  public email: string;

  public age: number;

  public weight: number;

  public height: number;

  static initModel(sequelize: sq.Sequelize): typeof Student {
    Student.init(
      {
        name: sq.STRING,
        email: sq.STRING,
        age: sq.INTEGER,
        weight: sq.DOUBLE,
        height: sq.DOUBLE,
      },
      {
        sequelize,
      }
    );
    return Student;
  }

  public static findStudentByEmail(email: string): Bluebird<Student> {
    return Student.findOne({
      where: { email },
    });
  }
}

export { Student };
