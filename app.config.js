// app.config.js
require('dotenv').config();

const appJson = require('./app.json');

module.exports = () => ({
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      API_URL: process.env.API_URL,
      ...(appJson.expo?.extra || {}),
      firebaseApiKey: process.env.FIREBASE_API_KEY,
    },
  },
});