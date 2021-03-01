import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';

import models from '../models';
import { validatePassword } from './routes/api/helpers';
import apiLoginRouter from './routes/api/authentication';
import apiNotesRouter from './routes/api/notes';
import apiUsersRouter from './routes/api/users';
import apiUsersNotesRouter from './routes/api/users/notes';

// Passport JWT Strategy
// http://www.passportjs.org/packages/passport-jwt/
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// TODO: create a secret key env variable (dotenv)
opts.secretOrKey = process.env.JWT_SECRET;
// CORS?
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(
  new JWTStrategy(opts, (jwtPayload, cb) => {
    models.User.findOne({
      where: {
        id: jwtPayload.id,
      },
    })
      .then((user) => {
        if (!user) {
          console.log('user not found (auth)');
          cb(null, false);
          return null;
        }
        console.log('successfully authenticated');
        cb(null, user);
        return null;
      })
      .catch((err) => {
        console.log('error', err);
      });
  }),
);

// Demo code https://github.com/passport/express-4.x-local-example/blob/master/server.js
// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new LocalStrategy({ session: false }, (username, password, cb) => {
    models.User.findAll({
      where: {
        username,
      },
    })
      .then((users) => {
        if (!users || users.length < 1) {
          console.log('no user');
          return cb(null, false);
        }
        const user = users[0];
        const passwordDigest = user.getDataValue('passwordDigest');
        return validatePassword(password, passwordDigest).then((same) => {
          if (same) {
            console.log('successfully authenticated');
            return cb(null, user);
          }
          console.log('password wrong');
          return cb(null, false);
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  }),
);

const app = express();

// App configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// TODO: configure cors per api
// Enable cors requests
app.use(cors());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// TODO: maybe not the best pattern
// Api Routes
app.use('/api/login', apiLoginRouter);
app.use('/api/notes', apiNotesRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/users/:userId/notes', apiUsersNotesRouter);

export default app;
