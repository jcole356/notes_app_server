import express from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';

const router = express.Router();

/* GET home page. */
router.get(
  '/',
  ensureLoggedIn('/login'),
  (_req, res) => {
    res.render('index', { title: 'Notes App Server' });
  },
);

export default router;
