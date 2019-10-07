import models from './models';

// TODO: clean up imports once api's are done
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { Strategy: JWTStrategy } = require('passport-jwt');
const { Strategy } = require('passport-local');
const path = require('path');

const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const apiLoginRouter = require('./routes/api/login');
const apiUsersRouter = require('./routes/api/users');

// Passport JWT Strategy
// http://www.passportjs.org/packages/passport-jwt/
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// TODO: create a secret key env variable
opts.secretOrKey = 'shhhhh';
// CORS?
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JWTStrategy(opts, (jwtPayload, cb) => {
  const { User } = models;
  const users = User.findOne({
    where: {
      id: jwtPayload.id,
    },
  });
  users.then((user) => {
    if (!user) {
      console.log('user not found (auth)');
      return cb(null, false);
    }
    console.log('successfully authenticated');
    return cb(null, user);
  })
    .catch((err) => {
      console.log('error', err);
    });
}));

// Demo code https://github.com/passport/express-4.x-local-example/blob/master/server.js
// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy({ session: false },
  (username, password, cb) => {
    const { User } = models;
    const users = User.findAll({
      where: {
        username,
      },
    });
    users.then((user) => {
      if (!user || user.length < 1) {
        console.log('no user');
        return cb(null, false);
      }
      if (user[0].getDataValue('password', password)) {
        console.log('password wrong');
        return cb(null, false);
      }
      console.log('successfully authenticated');
      return cb(null, user[0]);
    })
      .catch((err) => {
        console.log('error', err);
      });
  }));

const app = express();

// Configure view engine to render EJS templates.
// TODO: use path.join
// eslint-disable-next-line
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// App configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'cats suck' }));

// TODO: configure cors per api
// Enable cors requests
app.use(cors());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// TODO: remove the routes that aren't used by client
// Routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/users', usersRouter);

// Api Routes
app.use('/api/login', apiLoginRouter);
app.use('/api/users', apiUsersRouter);

module.exports = app;
