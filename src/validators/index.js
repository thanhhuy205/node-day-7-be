const register = require("./register.validator");
const login = require("./login.validator");
const post = require("./post.validation");
const refreshToken = require("./refreshToken.validator");
const verifyEmail = require("./verifyEmail.validator");
const changePassword = require("./changePassword.validator");

module.exports = {
  register,
  login,
  post,
  refreshToken,
  verifyEmail,
  changePassword,
};
