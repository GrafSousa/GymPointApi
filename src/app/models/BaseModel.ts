import sq, { Model } from 'sequelize';

abstract class BaseModel extends Model {
  public static initModel(sq: sq.Sequelize): void;
}

export { BaseModel };
