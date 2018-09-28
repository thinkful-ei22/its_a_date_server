'use strict';
const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaihttp = require('chai-http');

const { TEST_DATABASE_URL } = require('../config');

const User = require('../Models/userSchema');
const Event = require('../Models/eventSchema');
const seedUsers = require('../seed-data/seed-users.json');
const seedEvents = require('../seed-data/seed-events.json');

chai.use(chaihttp);
const expect = chai.expect;


describe('/API/USERS endpoint', function(){
  before(function(){
    this.timeout(6000);
    return mongoose.connect(TEST_DATABASE_URL)
      .then( () => mongoose.connection.dropDatabase() );
  });

  beforeEach(function(){
    this.timeout(6000);
    return User.insertMany(seedUsers)
      .then(() => Event.insertMany(seedEvents));
  });

  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });

  after(function(){
    return mongoose.disconnect();
  });

  describe('POST to /api/users', function(){
    it('should create a new user if valid credentials are provided', function(){
      const username = 'PrObAbLy_NoT_A_ReAl_UsErN@mE';
      const password = 'password12';
      const firstName = 'Janice';
      const lastName = 'User';
      const email = 'janice@foo.com';

      const newUser = {username, password, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.status).to.equal(201);
          expect(apiRes.body).to.have.keys('username', 'firstName', 'lastName', 'email', 'id');
          return User.findById(apiRes.body.id);
        })
        .then(dbRes => {
          expect(dbRes).to.exist;
          Object.keys(newUser).forEach(field => {
            if(field !== 'password'){
              expect(dbRes[field]).to.equal(newUser[field]);
            } else {
              expect(dbRes[field]).to.not.equal(newUser[field]);
            }
          });
        });
    });
  });

});