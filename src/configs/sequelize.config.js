// env port import
import env from './env.config.js';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  env.development.database,
  env.development.username,
  env.development.password,
  {
    host: env.development.host,
    dialect: 'mariadb',
    port: 3306,
    dialectOptions: { charset: 'utf8mb4', dateStrings: true, typeCast: true },
    timezone: '+09:00',
    define: {
      timestamps: true,
    },
  }
);

export default sequelize;
