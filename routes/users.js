import models from '../models';

const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (_req, res) => {
  const user = models.User.findAll({
    where: {
      username: 'testy',
    },
  });
  user.then((u) => { console.log('user', u); });
  res.send('respond with a resource');
});

module.exports = router;
