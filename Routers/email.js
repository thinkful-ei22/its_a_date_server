
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/', jwtAuth, (req, res, next) => {
  const {to, from, subject, text, html} = req.body;
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey('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');
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
        console.log(res.json(result));
        res.json(result)
          .status(200);
      }else{
        console.log('no result to display');
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;