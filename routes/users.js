import models from '../models';

import express from 'express';
const { ensureLoggedIn } = require('connect-ensure-login');

const router = express.Router();

/* GET users listings */
router.get(
  '/',
  ensureLoggedIn('/login'),
  (_req, res) => {
    const users = models.User.findAll();
    users.then((userList) => {
      const userListString = userList.map((user) => user.getDataValue('username')).join(', ');
      res.send(`The users name's are ${userListString}`);
    });
  },
);

/* GET user listing by id */
router.get(
  '/:userId',
  ensureLoggedIn('/login'),
  (req, res) => {
    const user = models.User.findOne({
      where: {
        id: req.params.userId,
      },
      include: [models.Note],
    });
    user.then((u) => {
      res.render('user', { user: u });
    });
  },
);

module.exports = router;
