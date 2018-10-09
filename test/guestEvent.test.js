
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

  describe('GET to /api/guestevents/:id', function(){
    it('should send back event data if valid id is provided', function(){
      let event;
      return Event.findOne()
        .then(_event => {
          event = _event;
          return chai.request(app).get('/api/guestevents/' + event.id);
        })
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.status).to.equal(200);
          const expectedKeys = [
            'id', 'scheduleOptions', 'restaurantOptions', 'activityOptions',
            'location', 'locationCity', 'title', 'description', 'shortUrl'
          ];
          expect(apiRes.body).to.contain.keys(expectedKeys);
          expect(apiRes.body.id).to.equal(event.id);
          expect(apiRes.body.title).to.equal(event.title);
          expect(apiRes.body.description).to.equal(event.description);
          expect(apiRes.body.shortUrl).to.equal(event.shortUrl);
          expect(apiRes.body.location.latitude).to.equal(event.location.latitude);
          expect(apiRes.body.location.longitude).to.equal(event.location.longitude);
          expect(apiRes.body.locationCity.city).to.equal(event.locationCity.city);
          expect(apiRes.body.locationCity.state).to.equal(event.locationCity.state);
          expect(apiRes.body.restaurantOptions.length).to.equal(event.restaurantOptions.length);
          expect(apiRes.body.activityOptions.length).to.equal(event.activityOptions.length);
          expect(apiRes.body.scheduleOptions.length).to.equal(event.scheduleOptions.length);
          apiRes.body.restaurantOptions.forEach( (option, index) => {
            ['_id', 'votes', 'website', 'name'].forEach(field => {
              expect(option[field].toString()).to.equal(event.restaurantOptions[index][field].toString());
            });
          });
          apiRes.body.activityOptions.forEach( (option, index) => {
            ['_id', 'votes', 'ebId', 'link', 'title', 'description', 'start', 'end'].forEach(field => {
              expect(option[field].toString()).to.equal(event.activityOptions[index][field].toString());
            });
          });
          apiRes.body.scheduleOptions.forEach( (option, index) => {
            ['votes', 'date', 'id'].forEach(field => {
              expect(option[field].toString()).to.equal(event.scheduleOptions[index][field].toString());
            });
          });
        });
    });

    it('should return 404 if event is not found', function(){
      return chai.request(app).get('/api/guestevents/a0a0a0a0a0a0a0a0a0a0a0a0')
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(404);
          expect(apiRes.body.message).to.equal('Not Found');
        });
    });

    it('should return 400 if ID is not valid Mongo ID', function(){
      return chai.request(app).get('/api/guestevents/zzz')
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(400);
          expect(apiRes.body.message).to.equal('ID is not valid');
        });
    });
  });





  describe('PUT to /api/guestevents/:id', function(){
    it.only('should update votes if valid ID is provided', function(){
      let event;
      let dateSelection;
      let restaurantSelection;
      let activitySelection;

      return Event.findOne()
        .then(_event => {
          event = _event;
          dateSelection = [event.scheduleOptions[0].id];
          restaurantSelection = [event.restaurantOptions[0].yelpId];
          activitySelection = [event.activityOptions[0].ebId];

          return chai.request(app).put('/api/guestevents/' + event.id)
            .send({
              dateSelection, restaurantSelection, activitySelection
            });
        })
        .then( (putRes) => {
          return Event.findById(event.id);
        })
        .then(dbResult => {
          const originalRest = event.restaurantOptions.find(rest => rest.yelpId === restaurantSelection[0]);
          const votedRest = dbResult.restaurantOptions.find(rest => rest.yelpId === restaurantSelection[0]);
          expect(votedRest.votes).to.equal(originalRest.votes + 1);
          /////// FINISH THIS TEST ////////////////
        });
    });
  });
});