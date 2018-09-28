const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const rp = require('request-promise');
router.use(jsonParser);


//sample restaurant search using city with two cuisines: https://developers.zomato.com/api/v2.1/search?entity_id=287&entity_type=city&cuisines=italian%2C%20chinese
//https://developers.zomato.com/api/v2.1/cities?lat=40.0000&lon=30.000
//get cities from search
router.get('/:lat/:lon', (req, res, next) => {   //change to use coordinates when we get the locator invovled
  return rp({
    uri: `https://developers.zomato.com/api/v2.1/cities?lat=${req.params.lat}&lon=${req.params.lon}`,
    headers: {
      'User-Agent': 'Request-Promise',
      'Accept':'application/json',
      'user-key':'02fb4b75d2055eb17f988da8447de24a',
    },
    json: true // Automatically parses the JSON string in the response
  })
    .then(data => {
      console.log('backend coordinates',req.params.lat, req.params.lon);
      console.log('data', data);
      const correctCity = data.location_suggestions[0];
      res.json(correctCity);
    })
    .catch(err => {
      next(err);
      // API call failed...
    });
});

//probably need to do the restaurant call on the front-end because we'll need the city_code that we get from the city get call
// router.get('/:cuisine',(req, res, next) => {
//   return rp({
//     uri: `https://developers.zomato.com/api/v2.1/search?entity_id=${cityCode}&entity_type=city&cuisines=${req.params.cuisine}`,
//     headers: {
//       'User-Agent': 'Request-Promise',
//       'Accept':'application/json',
//       'user-key':'02fb4b75d2055eb17f988da8447de24a',
//     },
//     json: true // Automatically parses the JSON string in the response
//   })
//     .then(data => {
//       console.log(data);
//       res.json(data);
//     })
//     .catch(err => {
//       next(err);
//     // API call failed...
//     });
// });

module.exports = router;