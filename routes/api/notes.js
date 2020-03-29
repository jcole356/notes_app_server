import models from '../../models';

import express from 'express';
const passport = require('passport');

const router = express.Router();

/* DELETE note by id */
router.delete(
  '/:noteId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { params: { noteId }, user: reqUser } = req;
    const userId = reqUser.getDataValue('id');
    const note = models.Note.findOne({
      where: {
        id: noteId,
      },
      include: [models.User],
    });
    note.then((n) => {
      if (n.user.id !== userId) {
        res.format({
          'application/json': () => {
            res.send('Not authorized');
          },
        });

        return;
      }
      n.destroy();
      res.format({
        'application/json': () => {
          res.send({ note: n });
        },
      });
    });
  },
);

/* PUT edit note by id */
router.put(
  '/:noteId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { body, params: { noteId }, user: reqUser } = req;
    const userId = reqUser.getDataValue('id');
    const note = models.Note.findOne({
      where: {
        id: noteId,
      },
      include: [models.User],
    });
    note.then((n) => {
      if (n.user.id !== userId) {
        res.format({
          'application/json': () => {
            res.send('Not authorized');
          },
        });

        return;
      }
      const updatedNote = { ...n, ...body };
      n.update(updatedNote);
      res.format({
        'application/json': () => {
          res.send({ note: n });
        },
      });
    });
  },
);

module.exports = router;
