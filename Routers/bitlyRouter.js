'use strict';
const mongoose = require('mongoose');
const Event = require('../Models/eventSchema');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {BITLY_BASE_URL} = require('../config');
const {BITLY_API_KEY} = require('../config');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const axios = require('axios');

router.get('/', jwtAuth, (req, res, next) => {
  let {longUrl} = req.query;
  let {eventId} = req.query;

  //undefined ID's will be parsed as strings
  if (eventId === 'undefined' || eventId === 'null') {
    const err = new Error('Event ID is not defined');
    err.status = 422;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    const err = new Error('The event ID is not a valid Mongo ID');
    err.status = 422;
    return next(err);
  }

  if (!longUrl.includes(eventId)){
    const err = new Error('The long URL must contain the event ID');
    err.status = 422;
    return next(err);
  }

  axios.get(`${BITLY_BASE_URL}/shorten?access_token=${BITLY_API_KEY}&longUrl=${longUrl}`)
    .then(({data}) => {
      return Event.findByIdAndUpdate(eventId,{shortUrl:data.data.url},{new:true}); 
    })
    .then( event => res.json(event.shortUrl))
    .catch(err => {
      next(err);
    });
});

module.exports = router;