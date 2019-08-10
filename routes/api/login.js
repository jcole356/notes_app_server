// TODO: this is the future use JWT strategy

const express = require('express');
const passport = require('passport');

const router = express.Router();

/* POST log in user */
router.post(
  '/',
  passport.authenticate('local'),
  (_req, res) => {
    res.send('You have been authenticated');
  },
);

module.exports = router;
