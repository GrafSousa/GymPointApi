import sq from 'sequelize';
import BaseModel from './BaseModel';

class User extends BaseModel {
  static initModel(sequelize: sq.Sequelize) {
    User.init(
      {
        name: sq.STRING,
        email: sq.STRING,
        password_hash: sq.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default User;
