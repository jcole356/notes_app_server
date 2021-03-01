import express from 'express';

import authenticateUser, { encryptPassword } from '../helpers';
import models from '../../../../models';

const router = express.Router();

// TODO: error handling
/* POST create new user */
router.post('/new', (req, res) => {
  const { User } = models;
  const {
    body: { email, username, password },
  } = req;
  User.findAll({
    where: {
      username,
    },
  }).then((users) => {
    if (!users || users.length < 1) {
      encryptPassword(password).then((hash) => {
        User.create({
          email,
          passwordDigest: hash,
          username,
        }).then(() => {
          authenticateUser(req, res);
        });
      });
    } else {
      // TODO: this should not return a 200
      // TODO: should add a util for this
      res.format({
        'application/json': () => {
          res.send({ message: 'User already exists' });
        },
      });
    }
  });
});

export default router;
