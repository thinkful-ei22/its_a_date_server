require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:

      process.env.DATABASE_URL || 'mongodb://localhost/its-a-date',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://localhost/thinkful-backend-test',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  BITLY_BASE_URL : process.env.BITLY_BASE_URL || 'https://api-ssl.bitly.com/v3',
  BITLY_API_KEY: process.env.BITLY_API_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
};

/* --------------------- Note ------------------- */
/* If app will not work in DEV environment, make sure to make
   a .env file!  Check slack group message for api keys */
