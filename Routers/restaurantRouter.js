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

//get cities from search
router.get('/:city/:state', (req, res, next) => {   //change to use coordinates when we get the locator invovled
  return rp({
    uri: 'https://developers.zomato.com/api/v2.1/cities?',
    headers: {
      'User-Agent': 'Request-Promise',
      'Accept':'application/json',
      'user-key':'02fb4b75d2055eb17f988da8447de24a',
    },
    qs:{
      q: req.params.city
    },
    json: true // Automatically parses the JSON string in the response
  })
    .then(data => {
      const list = data.location_suggestions;
      const correctCity = list.filter(item => item.state_code === req.params.state.toUpperCase());
      console.log(correctCity);
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