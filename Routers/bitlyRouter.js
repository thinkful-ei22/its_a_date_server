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
  console.log('req query',req.query);
  let {longUrl} = req.query;
  let {eventId} = req.query;
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