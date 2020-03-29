import express from 'express';
import passport from 'passport';

const router = express.Router();

// Login page
router.get(
  '/',
  (_req, res) => {
    res.render('login');
  },
);

// Login
router.post(
  '/',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (_req, res) => {
    res.redirect('/');
  },
);

module.exports = router;
