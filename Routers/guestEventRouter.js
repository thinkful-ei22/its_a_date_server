const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();

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

  return Event.findById(eventId)
    .then(event => {
      const newScheduleOptions = [...event.scheduleOptions];
      newScheduleOptions.forEach( (dateObject, index) => {
        if (dateObject.id === dateId) {
          newScheduleOptions[index].votes = newScheduleOptions[index].votes + 1;
        }
      });

      return Event.findByIdAndUpdate(eventId, {scheduleOptions: newScheduleOptions}, {new: true});
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