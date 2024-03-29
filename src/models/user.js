const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Note, { foreignKey: 'userId' });
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      passwordDigest: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
