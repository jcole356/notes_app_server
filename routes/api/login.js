const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// TODO: this is the future use JWT strategy
// TODO: create a secret key
const createToken = id => jwt.sign({ id }, 'shhhhh');

const router = express.Router();

/* POST log in user */
router.post(
  '/',
  (req, res) => {
    passport.authenticate('local', { failureRedirect: '/login', session: false }, (_err, user) => {
      console.log('response', res);
      const userId = user.getDataValue('id');
      console.log('user', userId);
      res.send({
        msg: 'Successful login',
        token: createToken(userId),
      });
    })(req, res);
  },
);

module.exports = router;
