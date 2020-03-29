import bcrypt from 'bcrypt';

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
      set(password) {
        bcrypt.hash(password, 10, (_err, hash) => {
          this.setDataValue('passwordDigest', hash);
          this.save();
        });
      },
    },
  });

  User.associate = (models) => {
    models.User.hasMany(models.Note);
  };

  return User;
};

export default user;
