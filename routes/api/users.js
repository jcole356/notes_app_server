import models from '../../models';

const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET user's notes by id */
router.get(
  '/:user_id/notes',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = models.User.findOne({
      where: {
        id: req.params.user_id,
      },
      include: [models.Note],
    });
    user.then((u) => {
      res.format({
        'application/json': () => {
          res.send(u.notes);
        },
      });
    });
  },
);

module.exports = router;
