const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.use(jsonParser);

router.post('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id; 
  const {title, description, scheduleOptions, restaurantOptions} = req.body;
  const newEvent = {
    userId,
    title,
    description,
    scheduleOptions,
    restaurantOptions
  };
  if(!newEvent.title){
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  if(!scheduleOptions){
    const err = new Error('Missing `scheduleOptions` in request body');
    err.status = 400;
    return next(err);
  }
  Event.create(newEvent)
    .then(() => {
      res
        .location(`${req.originalUrl}/${newEvent.id}`)
        .status(201)
        .json(newEvent);
    });
});

module.exports = router;