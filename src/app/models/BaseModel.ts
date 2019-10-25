import sq, { Model } from 'sequelize';

export default abstract class BaseModel extends Model {
  public static initModel(sq: sq.Sequelize): void;
}
