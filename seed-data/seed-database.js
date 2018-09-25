
'use strict';
const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const User = require('../Models/userSchema');
const Event = require('../Models/eventSchema');

const seedUsers = require('./seed-users.json');
const seedEvents = require('./seed-events.json');

console.log('Connecting to MongoDB');

mongoose.connect(DATABASE_URL)
  .then( () => {
    console.info('DROPPING DATABASE');
    mongoose.connection.db.dropDatabase();
  })
  .then( () => {
    return Promise.all([
      User.insertMany(seedUsers),
      User.createIndexes(),
      Event.insertMany(seedEvents),
      Event.createIndexes()
    ]);
  })
  .then( (results) => {
    console.log(results[0]);
    console.log(results[2]);
    console.info(`Inserted ${results[0].length} Users`);
    console.info(`Inserted ${results[2].length} Events`); 
    console.info('DISCONNECTING');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });