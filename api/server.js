// libraries
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// files
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knexConnection = require('../database/dbConfig.js');

const server = express();

// session configuration
const sessionOptions = {
  name: 'fiftyfirstdates',
  secret: process.env.COOKIE_SECRET || 'keep it secret, keep it safe!', 
  cookie: {
    secure: process.env.COOKIE_SECURE || false, 
    maxAge: 1000 * 60 * 60 * 24, 
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60 * 24,
  }),
};

// middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

// route setup
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up', session: req.session });
});

module.exports = server;
