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
  const dateId = req.body.dateSelection;
  const restaurantId = req.body.restaurantSelection;

  return Event.findById(eventId)
    .then(event => {
      const newScheduleOptions = [...event.scheduleOptions];
      const newRestaurantOptions = [...event.restaurantOptions];
      newScheduleOptions.forEach( (dateObject, index) => {
        if (dateObject.id === dateId) {
          newScheduleOptions[index].votes = newScheduleOptions[index].votes + 1;
        }
      });
      newRestaurantOptions.forEach( (restaurantObject, index) => {
        if (restaurantObject.zomatoId === restaurantId) {
          newRestaurantOptions[index].votes = newRestaurantOptions[index].votes + 1;
        }
      });
console.log("NEW OPTIONS", newRestaurantOptions);
      return Event.findByIdAndUpdate(eventId, {
        scheduleOptions: newScheduleOptions,
        restaurantOptions: newRestaurantOptions
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