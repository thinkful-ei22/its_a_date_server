const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const User = require('../Models/userSchema');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.use(jsonParser);

//get all events belonging to user
router.get('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  let filter = {userId};
  return Event.find(filter)
    .then(results =>{
      if(results){
        res.json(results);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
//get one event by id
router.get('/:id', jwtAuth, (req, res, next) => {
  const id = req.params.id;
  return Event.findById(id)
    .then(result => {
      if(result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
//create new event
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
//edit event
router.put('/:id', jwtAuth, (req, res, next) => {
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
//delete event
router.delete('/:id', jwtAuth, (req, res, next) => {
  const {id} = req.params;
  const userId = req.user.id;
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  Event.findOneAndRemove({_id:id, userId})
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;