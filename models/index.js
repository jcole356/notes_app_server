import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  Note: sequelize.import('./note'),
  User: sequelize.import('./user'),
};

export { sequelize };

export default models;
