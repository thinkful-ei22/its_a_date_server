# Goodtimes

An app for creating and sharing social events.

### *Let the Goodtimes roll!*

### Deployment

[Live app](https://goodtimes-client.herokuapp.com/)

[Client-side repo](https://github.com/thinkful-ei22/its_a_date_client)


### Tech-Stack

Front-end                      | Back-end
_______________________________|_________________________________
 HTML                          |  Node/Express
 CSS                           |  Sendgrid
 React                         |  MongoDB/mongoose
 Redux                         |  JSON Webtoken
 React-Router                  |  Bcrypt.js
 Redux-Form                    |  Passport.js
 React-Icons                   |  Axios
 Moment.js                     |  Request/Promise
 Lodash                        |  Bit.ly API
 Node-sass                     |  Yelp API
 Bing Maps API                 |  Event Bright API
 Enzyme/jest                   |  Continuous Integration (Travis)
 Continuous Deployment (Heroku)|  Continuous Deployment (Heroku)
                               |  Mocha/Chai



### API Documentation

##### Authorization

###### GET a JSON Web Token (Login)

* Type: `POST`

* URL: `https://itsadateserver.herokuapp.com/api/login`

* Required Request Headers: ```{
  Content-Type: `application/json`
}```

* Required Request JSON Body: ```{
  username: UsernameStringGoesHere,
  password: PasswordStringGoesHere
}```

* Response Body will be a JSON Web Token: ```{
  authToken: 'theTokenWillBeHereAsAString'
}```

* Note - Web Token is valid for 7 days from the issue date



##### Event Data

###### GET all events

* Requires valid JSON Webtoken

* Type: `GET`

* URL: `https://itsadateserver.herokuapp.com/api/events`

* Required Headers: ```{
  Authorization: `Bearer JSONWebToken`
}```

* Response Body will be an array of events: ```[
  {
  "_id" : ObjectId("111111111111111111111111"),
  "location" : {
    "latitude" : 39.7392,
    "longitude" : -104.9903
  },
  "locationCity" : {
    "city" : "Denver",
    "state" : "CO"
  },
  "userId" : ObjectId("000000000000000000000001"),
  "title" : "Italian Night",
  "description" : "Pizza for all!",
  "shortUrl" : "http://bit.ly/2E7TvIU",
  "draft" : false,
  "scheduleOptions" : [
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b0512887299"),
      "date" : "Mon, Sep 17, 2018 11:47 AM"
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b0512887298"),
      "date" : "Thu, Oct 18, 2018 6:47 PM"
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b0512887297"),
      "date" : "Tue, Oct 30, 2018 5:30 PM"
    }
  ],
  "restaurantOptions" : [
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729b"),
      "yelpId" : "jx5kzkP_9zwh9BW0WVPAWw",
      "website" : "https://www.yelp.com/biz/osteria-marco-denver?adjust_creative=eMUfDEmLylrpi34N26CFaw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=eMUfDEmLylrpi34N26CFaw",
      "name" : "Osteria Marco"
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729a"),
      "yelpId" : "V4K--8TIaM3iNxy85nELVw",
      "website" : "https://www.yelp.com/biz/sliceworks-denver?adjust_creative=eMUfDEmLylrpi34N26CFaw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=eMUfDEmLylrpi34N26CFaw",
      "name" : "Sliceworks"
    }
  ],
  "activityOptions" : [
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729d"),
      "ebId" : "41090701394",
      "link" : "https://www.eventbrite.com/e/kids-crossfit-ages-4-to-17-tickets-41090701394?aff=ebapi",
      "title" : "Kids CrossFit - Ages 4 to 17!",
      "description" : "get swole!",
      "start" : "",
      "end" : ""
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729c"),
      "ebId" : "49111123693",
      "link" : "https://www.eventbrite.com/e/open-mat-jiu-jitsu-all-levels-tickets-49111123693?aff=ebapi",
      "title" : "Open Mat Jiu Jitsu - ALL Levels",
      "description" : "Hi - ya!",
      "start" : "",
      "end" : ""
    }
  ]
}, ...
]```


###### GET a single event

* Requires valid JSON Webtoken

* Type: `GET`

* URL: `https://itsadateserver.herokuapp.com/api/events/eventID`
* Example: `https://itsadateserver.herokuapp.com/api/events/1a2b3c4e5f6a718a93201234`

* Required Headers: ```{
  Authorization: `Bearer JSONWebToken`
}```

* Response Body will be a single event: ```{
  "_id" : ObjectId("111111111111111111111111"),
  "location" : {
    "latitude" : 39.7392,
    "longitude" : -104.9903
  },
  "locationCity" : {
    "city" : "Denver",
    "state" : "CO"
  },
  "userId" : ObjectId("000000000000000000000001"),
  "title" : "Italian Night",
  "description" : "Pizza for all!",
  "shortUrl" : "http://bit.ly/2E7TvIU",
  "draft" : false,
  "scheduleOptions" : [
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b0512887299"),
      "date" : "Mon, Sep 17, 2018 11:47 AM"
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b0512887298"),
      "date" : "Thu, Oct 18, 2018 6:47 PM"
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b0512887297"),
      "date" : "Tue, Oct 30, 2018 5:30 PM"
    }
  ],
  "restaurantOptions" : [
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729b"),
      "yelpId" : "jx5kzkP_9zwh9BW0WVPAWw",
      "website" : "https://www.yelp.com/biz/osteria-marco-denver?adjust_creative=eMUfDEmLylrpi34N26CFaw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=eMUfDEmLylrpi34N26CFaw",
      "name" : "Osteria Marco"
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729a"),
      "yelpId" : "V4K--8TIaM3iNxy85nELVw",
      "website" : "https://www.yelp.com/biz/sliceworks-denver?adjust_creative=eMUfDEmLylrpi34N26CFaw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=eMUfDEmLylrpi34N26CFaw",
      "name" : "Sliceworks"
    }
  ],
  "activityOptions" : [
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729d"),
      "ebId" : "41090701394",
      "link" : "https://www.eventbrite.com/e/kids-crossfit-ages-4-to-17-tickets-41090701394?aff=ebapi",
      "title" : "Kids CrossFit - Ages 4 to 17!",
      "description" : "get swole!",
      "start" : "",
      "end" : ""
    },
    {
      "votes" : 0,
      "_id" : ObjectId("5bbce8a55bc32b051288729c"),
      "ebId" : "49111123693",
      "link" : "https://www.eventbrite.com/e/open-mat-jiu-jitsu-all-levels-tickets-49111123693?aff=ebapi",
      "title" : "Open Mat Jiu Jitsu - ALL Levels",
      "description" : "Hi - ya!",
      "start" : "",
      "end" : ""
    }
  ]
}```



