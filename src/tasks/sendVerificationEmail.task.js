const emailService = require("../services/email.service");

async function sendVerificationEmail(payload) {
  return await emailService.sendVerifyEmail(payload);
}

module.exports = sendVerificationEmail;
