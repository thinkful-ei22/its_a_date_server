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


router.get('/categories', (req,res,next) => {
  return rp({
    uri: 'https://api.yelp.com/v3/categories?locale=en_US',
    headers: {
      'User-Agent': 'Request-Promise',
      'Content-Type':'application/json',
      'Authorization': 'Bearer R9O5m5ck2UooNSbeTDkOJpwjhuseeqYrwhtoWiL5GFyOGpfMMJbOLr6yWuMkXW7OVQwcPwO5DiLsa-InjEeS4cBNJe7KtAmhud9JKwvdogB4_w5WRpExpDIUUHS3W3Yx'
    },
    json:true
  })
    .then(data => {
      const cuisines = data.categories.filter(category => category.parent_aliases.includes('food') || category.parent_aliases.includes('restaurants'));
      console.log(cuisines.length);
      res.json(cuisines);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/search/food/:term/:lat/:lon', (req,res, next) => {
  const {term, lat, lon} = req.params;
  return rp({
    uri: `https://api.yelp.com/v3/businesses/search?term=${term}&latitude=${lat}&longitude=${lon}&radius=24140`,
    headers: {
      'User-Agent': 'Request-Promise',
      'Content-Type':'application/json',
      'Authorization': 'Bearer R9O5m5ck2UooNSbeTDkOJpwjhuseeqYrwhtoWiL5GFyOGpfMMJbOLr6yWuMkXW7OVQwcPwO5DiLsa-InjEeS4cBNJe7KtAmhud9JKwvdogB4_w5WRpExpDIUUHS3W3Yx'
    },
    json:true
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/search/food/:lat/:lon', (req,res, next) => {
  const {lat, lon} = req.params;
  return rp({
    uri: `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&radius=24140`,
    headers: {
      'User-Agent': 'Request-Promise',
      'Content-Type':'application/json',
      'Authorization': 'Bearer R9O5m5ck2UooNSbeTDkOJpwjhuseeqYrwhtoWiL5GFyOGpfMMJbOLr6yWuMkXW7OVQwcPwO5DiLsa-InjEeS4cBNJe7KtAmhud9JKwvdogB4_w5WRpExpDIUUHS3W3Yx'
    },
    json:true
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;