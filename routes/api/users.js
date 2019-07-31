import models from '../../models';

const express = require('express');

const router = express.Router();

/* GET user's notes by id */
router.get(
  '/:user_id/notes',
  (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).send('User is not logged in');
      return;
    }
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
