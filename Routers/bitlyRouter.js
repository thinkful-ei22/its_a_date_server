'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {BITLY_BASE_URL} = require('../config');
const {BITLY_API_KEY} = require('../config');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const axios = require('axios');

router.get('/', jwtAuth, (req, res, next) => {
  let {longUrl} = req.query;
//   console.log('Bitly Req query',longUrl);
  axios.get(`${BITLY_BASE_URL}/shorten?access_token=${BITLY_API_KEY}&longUrl=${longUrl}`)
    .then(({data}) => {
    //   console.log('bitly response url',data);
      res.json(data.data.url);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;