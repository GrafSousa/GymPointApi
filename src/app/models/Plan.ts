import sq from 'sequelize';

import BaseModel from './BaseModel';

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
}

export default Plan;
