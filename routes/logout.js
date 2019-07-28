const express = require('express');

const router = express.Router();

// Logout
router.post(
  '/',
  (req, res) => {
    req.logout();
    res.redirect('/');
  },
);

module.exports = router;
