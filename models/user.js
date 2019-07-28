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
    },
  },
  {
    getterMethods: {
      password(password) {
        bcrypt.compare(password, this.passwordDigest, (_err, res) => res);
      },
    },
    setterMethods: {
      password(password) {
        bcrypt.hash(password, 10, (_err, hash) => {
          this.setDataValue('passwordDigest', hash);
        });
      },
    },
  });

  return User;
};

export default user;
