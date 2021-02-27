const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    passwordDigest: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    models.User.hasMany(models.Note);
  };

  return User;
};

export default user;
