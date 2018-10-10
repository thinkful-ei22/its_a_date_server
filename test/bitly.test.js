
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

  describe('GET to /api/bitly', function(){
    it('should return a short url when given a long url', function(){
      let event;
      return Event.create({title: 'NEWTITLE'})
        .then(_event => {
          event = _event;
          return chai.request(app)
            .get(`/api/bitly?longUrl=https://goodtimes-client.herokuapp.com/guestevents/${event.id}&eventId=${event.id}`)
            .set('Authorization', `Bearer ${webToken}`);
        })
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.status).to.equal(200);
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.body).to.exist;
          expect(apiRes.body.startsWith('http://bit.ly/')).to.equal(true);
          expect(apiRes.body.length).to.be.lessThan(30);
        });
    });

    it('should return an error if invalid MongoId is provided', function(){
      let eventId = '0101010101010101010101zz';
      return chai.request(app)
        .get(`/api/bitly?longUrl=https://goodtimes-client.herokuapp.com/guestevents/${eventId}&eventId=${eventId}`)
        .set('Authorization', `Bearer ${webToken}`)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.status).to.equal(422);
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.body).to.exist;
          expect(apiRes.body.message).to.equal('The event ID is not a valid Mongo ID');
          expect(apiRes.body.status).to.equal(422);
        });
    });

    it('should return an error if long url does not include event ID', function(){
      let event;
      return Event.create({title: 'NEWTITLE'})
        .then(_event => {
          event = _event;
          return chai.request(app)
            .get(`/api/bitly?longUrl=https://goodtimes-client.herokuapp.com/guestevents/&eventId=${event.id}`)
            .set('Authorization', `Bearer ${webToken}`);
        })
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.status).to.equal(422);
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.body).to.exist;
          expect(apiRes.body.message).to.equal('The long URL must contain the event ID');
          expect(apiRes.body.status).to.equal(422);
        });
    });

    it('should return an error if event ID is undefined', function(){
      let eventId;
      return chai.request(app)
        .get(`/api/bitly?longUrl=https://goodtimes-client.herokuapp.com/guestevents/${eventId}&eventId=${eventId}`)
        .set('Authorization', `Bearer ${webToken}`)
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.status).to.equal(422);
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.body).to.exist;
          expect(apiRes.body.message).to.equal('Event ID is not defined');
          expect(apiRes.body.status).to.equal(422);
        });
    });

    
  });


  
});