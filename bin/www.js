#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http';

import app from '../app';
import models, { sequelize } from '../models';
import { encryptPassword } from '../routes/api/helpers';

// TODO: Add environment variable for name
const debug = require('debug')('http');

debug.enabled = true;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  // eslint-disable-next-line
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/*
 * Listen on provided port, on all network interfaces.
 * Wait until sequelize has synced before listening
 */
const eraseDatabaseOnSync = true;

// Creates 2 users and 1 note assoiciated with User1
const createUsersAndNotes = async () => {
  const hash1 = await encryptPassword('password');
  const user1 = await models.User.create(
    {
      email: 'test@test.com',
      passwordDigest: hash1,
      username: 'testy',
    },
  );
  const note1 = await models.Note.create(
    {
      body: 'watch Stranger Things',
      color: 'red',
      title: 'Saturday',
    },
  );
  const note2 = await models.Note.create(
    {
      body: 'watch the Pats',
      color: 'blue',
      title: 'Sunday',
    },
  );
  const note3 = await models.Note.create(
    {
      body: 'do some work stuff',
      color: 'yellow',
      title: 'Monday',
    },
  );
  user1.addNotes([note1, note2, note3]);
  const hash2 = await encryptPassword('password');
  await models.User.create(
    {
      email: 'test2@test.com',
      passwordDigest: hash2,
      username: 'testy2',
    },
  );
};

// TODO: still erasing database on sync
sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  if (eraseDatabaseOnSync) {
    createUsersAndNotes();
  }
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});
