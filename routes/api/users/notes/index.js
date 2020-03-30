import express from 'express';
import passport from 'passport';

import models from '../../../../models';

const router = express.Router({ mergeParams: true });
const { Note, User } = models;

/* GET user's notes by id */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const {
      params: { userId: userIdParam },
      user: reqUser,
    } = req;
    const userId = reqUser.getDataValue('id');
    if (userIdParam !== 'current' && userId !== parseInt(userIdParam, 10)) {
      res.format({
        'application/json': () => {
          res.send('Not authorized');
        },
      });
    }
    User.findOne({
      where: {
        id: userId,
      },
      include: [Note],
    }).then(({ notes }) => {
      res.format({
        'application/json': () => {
          res.send({ notes });
        },
      });
    });
  },
);

// TODO: better reponses
/* POST create note for user */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const {
      body,
      params: { userId: userIdParam },
      user: reqUser,
    } = req;
    const userId = reqUser.getDataValue('id');
    if (userIdParam !== 'current' && userId !== parseInt(userIdParam, 10)) {
      res.format({
        'application/json': () => {
          res.send('Not authorized');
        },
      });
    }
    const { body: noteBody, title, color } = body;
    if (!title || !noteBody || !color) {
      res.format({
        'application/json': () => {
          res.send('Poorly formatted request');
        },
      });
    }
    Note.create(body).then((n) => {
      reqUser.addNote(n).then(() => {
        User.findOne({
          where: {
            id: userId,
          },
          include: [models.Note],
        }).then(({ notes }) => {
          res.format({
            'application/json': () => {
              res.send({ notes });
            },
          });
        });
      });
    });
  },
);

export default router;
