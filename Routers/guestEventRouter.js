const express = require('express');
const Event = require('../Models/eventSchema');
const router = express.Router();

const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
const jsonParser = bodyParser.json();

router.use(jsonParser);

router.get('/:id',  (req, res, next) => {
    const id = req.params.id;
    return Event.findById(id)
      .then(result => {
        if(result){
          res.json(result);
        }else{
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });


  module.exports = router;