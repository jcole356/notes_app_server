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
  // TODO: this should be a list of users
  user.then((u) => {
    console.log('user', u);
    res.send(`The user's name is ${u[0].dataValues.username}`);
  });
});

module.exports = router;
