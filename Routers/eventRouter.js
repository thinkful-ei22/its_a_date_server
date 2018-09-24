const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/', jwtAuth, (req, res, next) => {
    const userId = req.user.id; 
    const {title, dateOptions, foodOptions}
})