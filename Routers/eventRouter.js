const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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
  if(!newEvent.scheduleOptions){
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

router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {title, description, scheduleOptions, restaurantOptions} = req.body;
  const userId = req.user.id;
  const updatedEvent = {
    userId,
    title,
    description,
    scheduleOptions,
    restaurantOptions
  };
  //validate id
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  if(!updatedEvent.title){
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  if(!updatedEvent.scheduleOptions){
    const err = new Error('Missing `scheduleOptions` in request body');
    err.status = 400;
    return next(err);
  }
  Event.findOneAndUpdate({_id:id, userId}, updatedEvent, {new: true})
    .then(result => {
      if(result){
        res.json(result)
          .status(200);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;