import Bluebird from 'bluebird';
import sq, { ModelCtor, Model } from 'sequelize';
import { BaseModel } from './BaseModel';
import { Student } from './Student';
import { Plan } from './Plan';

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

  public static associate(models: { [key: string]: ModelCtor<Model> }): void {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }

  public static findAllNotCanceled(page: number): Bluebird<Enrollment[]> {
    return Enrollment.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
  }

  public static findOneNotCanceled(id: string): Bluebird<Enrollment> {
    return Enrollment.findOne({
      where: {
        id,
        canceled_at: null,
      },
    });
  }

  public static deleteEnrollment(enrollment: Enrollment): Bluebird<Enrollment> {
    enrollment.canceled_at = new Date();

    return enrollment.save();
  }
}

export { Enrollment };
