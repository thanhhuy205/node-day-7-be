const ms = require("ms");
const { jwtEnv } = require("../config/jwt");
const jwtService = require("./jwt.service");
const emailEnv = require("../config/email");
const transporter = require("../config/nodemailer");

class EmailService {
  async sendVerifyEmail(user, clientUrl = "http://localhost:3000") {
    const token = jwtService.sign({
      sub: user.id,
      exp: Date.now() + ms(jwtEnv.VERIFY_TOKEN_TIME),
    });
    const info = await transporter.sendMail({
      from: `"DEV" ${emailEnv.EMAIL}`,
      to: user.email,
      subject: "Xac thuc tai khoan",
      html: `<p><a href="${clientUrl}?token=${token}">Click here</a>!</p>`,
    });
    return info;
  }
}
const emailService = new EmailService();
module.exports = emailService;
