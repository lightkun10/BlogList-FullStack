/* eslint-disable global-require */
/**
 * app.js is establishing the connection to the database.
 */
const express = require('express');

require('express-async-errors');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const app = express();

mongoose.set('useCreateIndex', true);

logger.info(`connecting to ${config.MONGODB_URI}`);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });
mongoose.set('useFindAndModify', false);

app.use(cors()); // allow requests from other origins
app.use(express.static('build'));
app.use(express.json()); // json-parser to access data easily
app.use(middleware.requestLogger);

app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndPoint); // handler of requests with unknown endpoint
app.use(middleware.errorHandler); // handler of requests with result to errors

module.exports = app;
