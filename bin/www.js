#!/usr/bin/env node

import models, { sequelize } from '../models';

/**
 * Module dependencies.
 */

const http = require('http');
const debug = require('debug')('server:server');
// const models = require('../models');
// const { sequelize } = require('../models');
const app = require('../app');

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

// Creates 2 users
const createUsers = async () => {
  await models.User.create(
    {
      email: 'test@test.com',
      password: 'password',
      username: 'testy',
    },
  );
  await models.User.create(
    {
      email: 'test2@test.com',
      password: 'password',
      username: 'testy2',
    },
  );
};

// TODO: still erasing database on sync
sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
  if (eraseDatabaseOnSync) {
    createUsers();
  }
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});
