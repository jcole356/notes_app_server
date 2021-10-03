import express from 'express';
import passport from 'passport';

import db from '../../../../../models';

const router = express.Router({ mergeParams: true });
const {
  sequelize: {
    models: { Note, User },
  },
} = db;

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
    }).then(({ Notes }) => {
      res.format({
        'application/json': () => {
          res.send({ notes: Notes });
        },
      });
    });
  },
);

// TODO: better reponses (fails poorly if the color is wrong or something)
// TODO: received Notauthorized for successful note
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
          include: [Note],
        }).then(({ Notes }) => {
          res.format({
            'application/json': () => {
              console.log('RETURNING THE NOTES', Notes);
              res.send({ notes: Notes });
            },
          });
        });
      });
    });
  },
);

export default router;
