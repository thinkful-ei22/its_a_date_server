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

describe('/API/RESTAURANTS endpoint', function(){
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
  describe('API/RESTAURANTS/search/food/:term/:lat/:lon', function(){
    it('should return a list of restaurants matching the search term', function(){
      return chai.request(app)
        .get('/api/restaurants/search/food/italian/37.0834/-88.6000')
        .set('Authorization', 'Bearer R9O5m5ck2UooNSbeTDkOJpwjhuseeqYrwhtoWiL5GFyOGpfMMJbOLr6yWuMkXW7OVQwcPwO5DiLsa-InjEeS4cBNJe7KtAmhud9JKwvdogB4_w5WRpExpDIUUHS3W3Yx')
        .then(res => {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          return res.body;
        })
        .then(data => {
          expect(data).to.be.a('object');
          expect(data).to.have.keys('businesses', 'region', 'total');
          expect(data.businesses).to.be.a('array');
        });
    });
  });
  describe('API/RESTAURANTS/search/food/:lat/:lon', function(){
    it('should return a list of restaurants matching the search term', function(){
      return chai.request(app)
        .get('/api/restaurants/search/food/37.0834/-88.6000')
        .set('Authorization', 'Bearer R9O5m5ck2UooNSbeTDkOJpwjhuseeqYrwhtoWiL5GFyOGpfMMJbOLr6yWuMkXW7OVQwcPwO5DiLsa-InjEeS4cBNJe7KtAmhud9JKwvdogB4_w5WRpExpDIUUHS3W3Yx')
        .then(res => {
          expect(res).to.be.json;
          expect(res).to.have.status(200);
          return res.body;
        })
        .then(data => {
          expect(data).to.be.a('object');
          expect(data).to.have.keys('businesses', 'region', 'total');
          expect(data.businesses).to.be.a('array');
        });
    });
  });
});