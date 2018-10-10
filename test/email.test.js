const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaihttp = require('chai-http');
const {JWT_EXPIRY, JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const { TEST_DATABASE_URL } = require('../config');
const User = require('../Models/userSchema');
const seedUsers = require('../seed-data/seed-users.json');


chai.use(chaihttp);
const expect = chai.expect;

describe('/API/SEND endpoint', function(){
  let token;
  let user;

  before(function(){
    this.timeout(6000);
    return mongoose.connect(TEST_DATABASE_URL)
      .then( () => mongoose.connection.dropDatabase() );
  });
  
  beforeEach(function(){
    this.timeout(6000);
    return User.insertMany(seedUsers)
      .then((users)=>{
        user = users[0];
        token = jwt.sign({user}, JWT_SECRET, {
          subject: user.username,
          expiresIn: JWT_EXPIRY
        });
      });
  });
  
  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function(){
    return mongoose.disconnect();
  });
  describe('/API/SEND POST endpoint', function(){
    it('should send an email if valid input is provided', function(){
      const msg = {
        to: 'jennifer.colna@example.com',
        from: 'jennifer.colna@example.com',
        subject: 'test email',
        text: 'this is a test email',
        html: '<p>this is a test email</p>'
      };
      return chai.request(app)
        .post('/api/send')
        .set('Authorization', `Bearer ${token}`)
        .send(msg)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes).to.have.status(200);
          return apiRes.request._data;
        })
        .then(data => {
          expect(data).to.have.keys('to', 'from', 'subject', 'text', 'html');
          expect(data.to).to.equal('jennifer.colna@example.com');
          expect(data.from).to.equal('jennifer.colna@example.com');
          expect(data.subject).to.equal('test email');
          expect(data.text).to.equal('this is a test email');
          expect(data.html).to.equal('<p>this is a test email</p>');
        });
    });
    it('should return an error if missing `to`', function(){
      const msg = {
        from: 'jennifer.colna@example.com',
        subject: 'test email',
        text: 'this is a test email',
        html: '<p>this is a test email</p>'
      };
      return chai.request(app)
        .post('/api/send')
        .set('Authorization', `Bearer ${token}`)
        .send(msg)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes).to.have.status(400);
          return apiRes.body.message;
        })
        .then(data => {
          expect(data).to.equal('Missing `to` in request body');
        });
    });
    it('should return an error if missing `from`', function(){
      const msg = {
        to: 'jennifer.colna@example.com',
        subject: 'test email',
        text: 'this is a test email',
        html: '<p>this is a test email</p>'
      };
      return chai.request(app)
        .post('/api/send')
        .set('Authorization', `Bearer ${token}`)
        .send(msg)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes).to.have.status(400);
          return apiRes.body.message;
        })
        .then(data => {
          expect(data).to.equal('Missing `from` in request body');
        });
    });
    it('should return an error if missing `subject`', function(){
      const msg = {
        to: 'jennifer.colna@example.com',
        from: 'jennifer.colna@example.com',
        text: 'this is a test email',
        html: '<p>this is a test email</p>'
      };
      return chai.request(app)
        .post('/api/send')
        .set('Authorization', `Bearer ${token}`)
        .send(msg)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes).to.have.status(400);
          return apiRes.body.message;
        })
        .then(data => {
          expect(data).to.equal('Missing `subject` in request body');
        });
    });
    it('should return an error if missing `text`', function(){
      const msg = {
        to: 'jennifer.colna@example.com',
        from: 'jennifer.colna@example.com',
        subject: 'this is a test email',
        html: '<p>this is a test email</p>'
      };
      return chai.request(app)
        .post('/api/send')
        .set('Authorization', `Bearer ${token}`)
        .send(msg)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes).to.have.status(400);
          return apiRes.body.message;
        })
        .then(data => {
          expect(data).to.equal('Missing `body` in request body');
        });
    });
    it('should return an error if missing `html`', function(){
      const msg = {
        to: 'jennifer.colna@example.com',
        from: 'jennifer.colna@example.com',
        subject: 'this is a test email',
        text: 'this is a test email'
      };
      return chai.request(app)
        .post('/api/send')
        .set('Authorization', `Bearer ${token}`)
        .send(msg)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes).to.have.status(400);
          return apiRes.body.message;
        })
        .then(data => {
          expect(data).to.equal('Missing `body` in request body');
        });
    });
  });
});