const note = (sequelize, DataTypes) => {
  const Note = sequelize.define('note', {
    body: {
      type: DataTypes.STRING, // TODO: might want more characters
    },
    color: {
      type: DataTypes.ENUM('red', 'green', 'yellow', 'blue'),
    },
    title: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  });

  // How is this syntax?
  Note.associate = (models) => {
    models.Note.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Note;
};

export default note;
