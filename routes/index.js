const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');

const router = express.Router();

/* GET home page. */
router.get(
  '/',
  ensureLoggedIn('/login'),
  (_req, res) => {
    res.render('index', { title: 'Notes App Server' });
  },
);

module.exports = router;
