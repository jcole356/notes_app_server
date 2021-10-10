const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      models.Note.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Note.init(
    {
      body: DataTypes.STRING,
      title: DataTypes.STRING,
      color: DataTypes.ENUM('red', 'green', 'yellow', 'blue'),
    },
    {
      sequelize,
      modelName: 'Note',
    },
  );

  return Note;
};
