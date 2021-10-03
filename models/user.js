'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // TODO: this won't work with my older models
    static associate(models) {
      // models.User.hasMany(models.Note);
    }
  };
  User.init({
    username: DataTypes.STRING,
    passwordDigest: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};
