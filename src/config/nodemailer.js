const nodemailer = require("nodemailer");
const emailEnv = require("./email");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailEnv.EMAIL,
    pass: emailEnv.APP_PASSWORD,
  },
});

module.exports = transporter;
