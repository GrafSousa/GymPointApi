import sq from 'sequelize';
import bcrypt from 'bcryptjs';

import BaseModel from './BaseModel';

class User extends BaseModel {
  public id: number;

  public name: string;

  public password: string;

  public password_hash: string;

  static initModel(sequelize: sq.Sequelize) {
    User.init(
      {
        name: sq.STRING,
        email: sq.STRING,
        password: sq.VIRTUAL,
        password_hash: sq.STRING,
      },
      {
        sequelize,
      }
    );
    User.beforeSave(async (user: User) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  public checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
