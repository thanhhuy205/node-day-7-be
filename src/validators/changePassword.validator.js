const Joi = require("joi");

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(4).required(),
  confirm_new_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "confirm_new_password must match new_password",
    }),
}).unknown(false);

module.exports = changePasswordSchema;
