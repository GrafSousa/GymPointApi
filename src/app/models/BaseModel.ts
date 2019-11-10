import sq, { Model, ModelCtor } from 'sequelize';

abstract class BaseModel extends Model {
  public static initModel(sq: sq.Sequelize): void;

  public static associate(models: { [key: string]: ModelCtor<Model> }): void;
}

export { BaseModel };
