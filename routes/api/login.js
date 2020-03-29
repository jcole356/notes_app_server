import express from 'express';
import authenticateUser from './helpers';

const router = express.Router();

/* POST log in user */
// TODO: error handling
router.post(
  '/',
  (req, res) => {
    authenticateUser(req, res);
  },
);

module.exports = router;
