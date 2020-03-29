import authenticateUser, { encryptPassword } from './helpers';
import models from '../../models';

const express = require('express');
const passport = require('passport');

const router = express.Router();

/* POST create new user */
// TODO: error handling
router.post(
  '/new',
  (req, res) => {
    const { User } = models;
    const { body: { email, username, password } } = req;
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
  },
);

// TODO: this belongs in a different directory
/* GET user's notes by id */
router.get(
  '/:userId/notes',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { params: { userId: userIdParam }, user: reqUser } = req;
    const userId = reqUser.getDataValue('id');
    if (userIdParam !== 'current' && userId !== parseInt(userIdParam, 10)) {
      res.format({
        'application/json': () => {
          res.send('Not authorized');
        },
      });

      return;
    }
    const user = models.User.findOne({
      where: {
        id: userId,
      },
      include: [models.Note],
    });
    user.then((u) => {
      res.format({
        'application/json': () => {
          res.send({ notes: u.notes });
        },
      });
    });
  },
);

// This also doesn't belong here
/* POST create note for user */
router.post(
  '/:userId/notes',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { body, params: { userId: userIdParam }, user: reqUser } = req;
    const userId = reqUser.getDataValue('id');
    if (userIdParam !== 'current' && userId !== parseInt(userIdParam, 10)) {
      res.format({
        'application/json': () => {
          res.send('Not authorized');
        },
      });

      return;
    }
    const { body: noteBody, title, color } = body;
    if (!title || !noteBody || !color) {
      res.format({
        'application/json': () => {
          res.send('Poorly formatted request');
        },
      });

      return;
    }
    models.Note.create(body).then((n) => {
      reqUser.addNote(n).then(() => {
        const user = models.User.findOne({
          where: {
            id: userId,
          },
          include: [models.Note],
        });
        user.then((u) => {
          res.format({
            'application/json': () => {
              res.send({ notes: u.notes });
            },
          });
        });
      });
    });
  },
);

module.exports = router;
