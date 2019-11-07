/* eslint-disable @typescript-eslint/camelcase */
import sq from 'sequelize';

import Bluebird from 'bluebird';
import { BaseModel } from './BaseModel';

class Plan extends BaseModel {
  public id: number;

  public title: string;

  public duration: number;

  public price: number;

  public excluded: boolean;

  public static initModel(sequelize: sq.Sequelize): typeof Plan {
    Plan.init(
      {
        title: sq.STRING,
        duration: sq.INTEGER,
        price: sq.DOUBLE,
        excluded: {
          type: sq.BOOLEAN,
          defaultValue: false,
        },
      },
      { sequelize }
    );
    return Plan;
  }

  public static findAllNotExcluded(): Bluebird<Plan[]> {
    return Plan.findAll({
      where: { excluded: false },
      attributes: ['id', 'title', 'duration', 'price'],
    });
  }

  public static findOneByIdAndNotCanceled(id: string): Bluebird<Plan> {
    return Plan.findOne({
      where: { id, excluded: false },
    });
  }

  public static findOneByTitleAndNotCanceled(title: string): Bluebird<Plan> {
    return Plan.findOne({
      where: { title, excluded: false },
    });
  }
}

export { Plan };
