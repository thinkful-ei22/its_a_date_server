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
    const username = 'PrObAbLy_NoT_A_ReAl_UsErN@mE';
    const password = 'password12';
    const firstName = 'Janice';
    const lastName = 'User';
    const email = 'janice@foo.com';

    it('should create a new user if valid credentials are provided', function(){
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

    it('should return appropriate error if username is missing', function(){
      const newUser = {password, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Missing \'username\' in request body');
          expect(apiRes.body.location).to.equal('username');
          return User.find({firstName: 'Janice'});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });


    it('should return appropriate error if password is missing', function(){
      const newUser = {username, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Missing \'password\' in request body');
          expect(apiRes.body.location).to.equal('password');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should set default empty strings for first name, last name, and email', function(){
      const newUser = {username, password};

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
          expect(dbRes.firstName).to.equal('');
          expect(dbRes.lastName).to.equal('');
          expect(dbRes.email).to.equal('');
        });
    });

    it('should return appropriate error if username is not trimmed', function(){
      const newUser = {username: ' whitespace', password, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Cannot start or end with whitespace');
          expect(apiRes.body.location).to.equal('username');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if password is not trimmed', function(){
      const newUser = {username, password: ' notTrimmed ', firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Cannot start or end with whitespace');
          expect(apiRes.body.location).to.equal('password');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if username is not a string', function(){
      const newUser = {username: 7, password, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Incorrect field type: expected string');
          expect(apiRes.body.location).to.equal('username');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if password is not a string', function(){
      const newUser = {username, password: 1234567890, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Incorrect field type: expected string');
          expect(apiRes.body.location).to.equal('password');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if first name is not a string', function(){
      const newUser = {username, password, firstName: ['array'], lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Incorrect field type: expected string');
          expect(apiRes.body.location).to.equal('firstName');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if last name is not a string', function(){
      const newUser = {username, password, firstName, lastName: {lastName: 'object'}, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Incorrect field type: expected string');
          expect(apiRes.body.location).to.equal('lastName');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if email is not a string', function(){
      const newUser = {username, password, firstName, lastName, email: true};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Incorrect field type: expected string');
          expect(apiRes.body.location).to.equal('email');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if password is too long', function(){
      const longPassword = '1234567890|1234567890|1234567890|1234567890|1234567890|1234567890|1234567890';
      const newUser = {username, password: longPassword, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(longPassword.length).to.be.greaterThan(72);
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Must be at most 72 characters long');
          expect(apiRes.body.location).to.equal('password');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if password is too short', function(){
      const shortPassword = '123456789';
      const newUser = {username, password: shortPassword, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(shortPassword.length).to.be.lessThan(10);
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Must be at least 10 characters long');
          expect(apiRes.body.location).to.equal('password');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should return appropriate error if username is too short', function(){
      const newUser = {username: '', password, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Must be at least 1 characters long');
          expect(apiRes.body.location).to.equal('username');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });

    it('should not create user if username is not unique', function(){
      const newUser = {username: user.username, password, firstName, lastName, email};

      return chai.request(app).post('/api/users').send(newUser)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(422);
          expect(apiRes.body).to.include.keys('code', 'reason', 'location', 'message');
          expect(apiRes.body.reason).to.equal('ValidationError');
          expect(apiRes.body.message).to.equal('Username already taken');
          expect(apiRes.body.location).to.equal('username');
          return User.find({username});
        })
        .then(dbRes => {
          expect(dbRes).to.be.empty;
        });
    });
  });





  describe('GET to /api/users', function(){
    it('should return user data if valid json webtoken is provided', function(){
      let exampleUser;

      return chai.request(app).get('/api/users')
        .set('Authorization', `Bearer ${webToken}`)
        .set('Content-Type', 'application/json')
        .then(apiRes => {
          exampleUser = apiRes.body;
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.unauthorized).to.equal(false);
          expect(apiRes.body).to.have.keys('username', 'email', 'id');
          expect(apiRes.body.username).to.equal(user.username);
          expect(apiRes.body.email).to.equal(user.email);
          expect(apiRes.body).to.not.include.keys('password');
          return User.findById(apiRes.body.id);
        })
        .then(dbRes => {
          expect(dbRes).to.exist;
          expect(dbRes.username).to.equal(exampleUser.username);
          expect(dbRes.firstName).to.equal(exampleUser.firstName);
          expect(dbRes.lastName).to.equal(exampleUser.lastName);
          expect(dbRes.email).to.equal(exampleUser.email);
        });
    });

    it('should have proper headers for bad token', function(){
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

    it('should have proper headers if token is missing', function(){
      return chai.request(app).get('/api/users')
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