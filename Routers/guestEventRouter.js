'use strict';

const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.get('/:id',  (req, res, next) => {
  const id = req.params.id;
  return Event.findById(id)
    .then(result => {
      if(result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


//When the guest submits votes  
router.put('/:id',  (req, res, next) => {
  const eventId = req.params.id;
  const dateIds = req.body.dateSelection;
  const restaurantIds = req.body.restaurantSelection;
  const activityIds = req.body.activitySelection;

  return Event.findById(eventId)
    .then(event => {
      const newScheduleOptions = [...event.scheduleOptions];
      const newRestaurantOptions = [...event.restaurantOptions];
      const newActivityOptions = [...event.activityOptions];
      newScheduleOptions.forEach( (dateObject, index) => {
        if (dateIds.includes(dateObject.id)) {
          newScheduleOptions[index].votes = newScheduleOptions[index].votes + 1;
        }
      });
      newRestaurantOptions.forEach( (restaurantObject, index) => {
        if (restaurantIds.includes(restaurantObject.zomatoId)) {
          newRestaurantOptions[index].votes = newRestaurantOptions[index].votes + 1;
        }
      });
      newActivityOptions.forEach((activityObject, index) => {
        if(activityIds.includes(activityObject.ebId)){
          newActivityOptions[index].votes = newActivityOptions[index].votes +1;
        }}
      );
      console.log('NEW OPTIONS', newRestaurantOptions);
      return Event.findByIdAndUpdate(eventId, {
        scheduleOptions: newScheduleOptions,
        restaurantOptions: newRestaurantOptions,
        activityOptions: newActivityOptions
      }, {new: true});
    })
    .then(result => {
      if(result){
        res.json(result);
      } else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;