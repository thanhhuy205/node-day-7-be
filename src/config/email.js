const dotenv = require("dotenv");
dotenv.config();

const emailEnv = {
  EMAIL: process.env.EMAIL,
  APP_PASSWORD: process.env.APP_PASSWORD,
};

module.exports = emailEnv;
