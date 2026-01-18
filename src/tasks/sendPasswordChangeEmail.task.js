const emailService = require("../services/email.service");

async function sendPasswordChangeEmail(payload) {
  return await emailService.sendPasswordChangeEmail(payload);
}

module.exports = sendPasswordChangeEmail;
