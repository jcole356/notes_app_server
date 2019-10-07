import models from '../../models';

const express = require('express');
const passport = require('passport');

const router = express.Router();

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

module.exports = router;
