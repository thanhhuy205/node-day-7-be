const Joi = require("joi");

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
}).unknown(false);

module.exports = verifyEmailSchema;
