
'use strict';
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const User = require('../Models/userSchema');
const MyEvent = require('../Models/eventSchema');

const seedUsers = require('./seed-users.json');
const seedEvents = require('./seed-events.json');

console.log('Connecting to MongoDB');

mongoose.connect(DATABASE_URL)
  .then( function(){
    console.info('DROPPING DATABASE');
    return mongoose.connection.db.dropDatabase();
  })
  .then( () => {
    return Promise.all([
      User.insertMany(seedUsers),
      User.createIndexes(),
      MyEvent.insertMany(seedEvents),
      MyEvent.createIndexes()
    ]);
  })
  .then( (results) => {
    console.info('results=',results);
    console.info('DISCONNECTING');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });