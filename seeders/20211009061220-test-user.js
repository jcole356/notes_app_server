'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordDigest = await bcrypt.hash('password', 10);
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'testy',
          email: 'test@test.com',
          passwordDigest,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
