import { Options } from 'sequelize';

const databaseConfig: Options = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true,
  },
};

export default databaseConfig;
