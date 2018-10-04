
const express = require('express');
const router = express.Router();
const passport = require('passport');
const SENDGRID_API_KEY = require('../config');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/', jwtAuth, (req, res, next) => {
  const {to, from, subject, text, html} = req.body;
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY.SENDGRID_API_KEY);
  const msg = {
    to,
    from,
    subject,
    text,
    html
  };
  if(!msg.to){
    const err = new Error('Missing `to` in request body');
    err.status = 400;
    return next(err);
  }
  if(!msg.from){
    const err = new Error('Missing `from` in request body');
    err.status = 400;
    return next(err);
  }
  sgMail.send(msg)
    .then(result => {
      if(result){
        res.json(result)
          .status(200);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;