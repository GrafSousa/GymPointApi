import sq from 'sequelize';
import { BaseModel } from './BaseModel';

class Enrollment extends BaseModel {
  public id: number;

  public student_id: number;

  public plan_id: number;

  public start_date: Date;

  public end_date: Date;

  public price: number;

  public canceled_at?: Date;

  public static initModel(sequelize: sq.Sequelize): typeof Enrollment {
    this.init(
      {
        start_date: sq.DATE,
        end_date: sq.DATE,
        price: sq.DOUBLE,
        canceled_at: sq.DATE,
      },
      { sequelize }
    );
    return Enrollment;
  }

  public static associate(models): void {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export { Enrollment };
