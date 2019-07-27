import models from './models';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const { Strategy } = require('passport-local');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Demo code https://github.com/passport/express-4.x-local-example/blob/master/server.js
// TODO: use bcrypt to hash and salt the password

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  (username, password, cb) => {
    const { User } = models;
    const users = User.findAll({
      where: {
        username,
      },
    });
    users.then((user) => {
      // TODO: error handling
      // if (err) {
      //   return cb(err);
      // }
      if (!user || user.length < 1) {
        console.log('no user');
        return cb(null, false);
      }
      if (user[0].dataValues.passwordDigest !== password) {
        console.log('password wrong');
        return cb(null, false);
      }
      console.log('successfully authenticated');
      return cb(null, user[0]);
    });
  },
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.

passport.serializeUser((user, cb) => {
  console.log('serializeUser');
  cb(null, user.id);
});

// TODO: error handling
passport.deserializeUser((id, cb) => {
  console.log('deserializeUser', id);
  const users = models.User.findAll({ where: { id } });

  users.then((user) => {
    // if (err) {
    //   return cb(err);
    // }
    cb(null, user[0]);
    return null;
  });
});

const app = express();

// Configure view engine to render EJS templates.
// TODO: use path.join
// eslint-disable-next-line
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'cats suck' }));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

// TODO: auth router
app.get(
  '/login',
  (_req, res) => {
    res.render('login');
  },
);

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (_req, res) => {
    res.redirect('/');
  },
);

app.use('/users', usersRouter);

module.exports = app;
