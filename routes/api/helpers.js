import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

// TODO: create a secret key env variable (dotenv)
const createToken = (id) => jwt.sign({ id }, 'shhhhh');

// TODO: should salt with username or random hash as well
export const encryptPassword = (password) => (
  bcrypt.hash(password, 10)
);

export const validatePassword = (password, passwordDigest) => (
  bcrypt.compare(password, passwordDigest)
);

export default (req, res) => {
  passport.authenticate('local', { session: false }, (_err, user) => {
    if (!user) {
      res.format({
        'application/json': () => {
          res.send({ message: 'Wrong username or password' });
        },
      });
    }
    const userId = user.getDataValue('id');
    res.format({
      'application/json': () => {
        res.send({
          message: 'Successful login',
          token: createToken(userId),
        });
      },
    });
  })(req, res);
};
