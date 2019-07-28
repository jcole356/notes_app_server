const express = require('express');

const router = express.Router();

// Logout
router.post(
  '/',
  (req, res) => {
    req.session.destroy(() => {
      console.log('logging out');
      res.redirect('/');
    });
  },
);

module.exports = router;
