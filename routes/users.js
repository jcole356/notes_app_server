import models from '../models';

const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (_req, res) => {
  const users = models.User.findAll();
  users.then((userList) => {
    console.log('userList', userList);
    const userListString = userList.map(user => user.dataValues.username).join(', ');
    res.send(`The users name's are ${userListString}`);
  });
});

module.exports = router;
