module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    passoword: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    dialect: 'postgres',
  },
  production: {
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true,
    },
  },
};
