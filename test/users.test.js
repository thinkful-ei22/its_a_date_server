'use strict';
const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaihttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');

const User = require('../Models/userSchema');
const Event = require('../Models/eventSchema');
const seedUsers = require('../seed-data/seed-users.json');
const seedEvents = require('../seed-data/seed-events.json');

chai.use(chaihttp);
const expect = chai.expect;


describe('/API/USERS endpoint', function(){
  let webToken;
  let user;

  before(function(){
    this.timeout(6000);
    return mongoose.connect(TEST_DATABASE_URL)
      .then( () => mongoose.connection.dropDatabase() );
  });

  beforeEach(function(){
    this.timeout(6000);
    return User.insertMany(seedUsers)
      .then(insertedUsers => {
        user = insertedUsers[0];
        webToken = jwt.sign({user}, JWT_SECRET, {
          subject: user.username,
          expiresIn: JWT_EXPIRY,
          algorithm: 'HS256'
        });
      })
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

  describe('GET to /api/users', function(){
    it('should return user data if valid json webtoken is provided', function(){
      return chai.request(app).get('/api/users')
        .set('Authorization', `Bearer ${webToken}`)
        .set('Content-Type', 'application/json')
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.unauthorized).to.equal(false);
          expect(apiRes.body).to.have.keys('username', 'email', 'id');
          expect(apiRes.body.username).to.equal(user.username);
          expect(apiRes.body.email).to.equal(user.email);
          expect(apiRes.body).to.not.include.keys('password');
        });
    });

    it.only('should have proper headers for bad token', function(){
      return chai.request(app).get('/api/users')
        .set('Authorization', `Bearer ${webToken}a`)
        .set('Content-Type', 'application/json')
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.unauthorized).to.equal(true);
          expect(apiRes.statusCode).to.equal(401);
          
          const resText = JSON.parse(apiRes.text);
          expect(resText.name).to.equal('AuthenticationError');
          expect(resText.message).to.equal('Unauthorized');
          expect(resText.status).to.equal(401);
        });
    });
  });

});