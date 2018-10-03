'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const {jwtStrategy} = require('./Auth/strategies');
const {localStrategy} = require('./Auth/strategies');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const registrationRouter = require('./Routers/userRouter');
const eventRouter = require('./Routers/eventRouter');
const loginRouter = require('./Routers/authRouter');
const restaurantRouter = require('./Routers/restaurantRouter');
const guestEventRouter = require('./Routers/guestEventRouter');
const emailRouter = require('./Routers/email');
const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.json());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use('/api/events', eventRouter);
app.use('/api/guestevents', guestEventRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', registrationRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/send', emailRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app;
