// import Sequelize from 'sequelize';

// let sequelize; // eslint-disable-line import/no-mutable-exports

// if (process.env.NODE_ENV === 'production') {
//   sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: true,
//     },
//   });
// } else {
//   sequelize = new Sequelize(
//     process.env.DATABASE,
//     process.env.DATABASE_USER,
//     process.env.DATABASE_PASSWORD,
//     {
//       dialect: 'postgres',
//     },
//   );
// }

// const models = {
//   Note: sequelize.import('./note'),
//   User: sequelize.import('./user'),
// };

// Object.keys(models).forEach((model) => {
//   models[model].associate(models);
// });

// export { sequelize };

// export default models;
