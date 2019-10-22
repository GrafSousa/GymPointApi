import sq, { Model } from 'sequelize';

export default abstract class BaseModel extends Model {
  static initModel(_: sq.Sequelize): void {}
}
