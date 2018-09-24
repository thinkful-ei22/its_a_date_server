
'use strict';
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const { User, Event } = require('../models/models.js');

const seedUsers = require('./seed-users.json');
const seedEvents = require('./seed-events.json');

console.log('Connecting to MongoDB');
return mongoose.connect(DATABASE_URL)
  .then( function(){
    console.info('DROPPING DATABASE');
    return mongoose.connection.db.dropDatabase();
  })
  .then( () => {
    return Promise.all([
      User.insertMany(seedUsers),
      Event.insertMany(seedEvents)
    ]);
  })
  .then( ([res1, res2]) => {
    console.info(res1, res2);
    console.info('DISCONNECTING');
    mongoose.disconnect();
  });