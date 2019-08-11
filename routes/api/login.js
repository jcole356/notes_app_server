const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// TODO: create a secret key env variable
const createToken = id => jwt.sign({ id }, 'shhhhh');

const router = express.Router();

/* POST log in user */
// TODO: error handling
// TODO: may also be able to just call req.user for the user here
router.post(
  '/',
  (req, res) => {
    passport.authenticate('local', { session: false }, (_err, user) => {
      const userId = user.getDataValue('id');
      res.send({
        msg: 'Successful login',
        token: createToken(userId),
      });
    })(req, res);
  },
);

module.exports = router;
