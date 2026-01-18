const { jwtEnv } = require("../config/jwt");
const jwtService = require("./jwt.service");
const emailEnv = require("../config/email");
const transporter = require("../config/nodemailer");

class EmailService {
  async sendVerifyEmail(user, clientUrl = "http://localhost:3000") {
    const token = await jwtService.sign(
      { sub: user.user_id },
      { expiresIn: jwtEnv.VERIFY_TOKEN_TIME },
    );

    return transporter.sendMail({
      from: `"DEV" <${emailEnv.EMAIL}>`,
      to: user.email,
      subject: "Xác thực tài khoản",
      html: `<a href="${clientUrl}/verify-email?token=${token}">Xác thực email</a>`,
    });
  }

  async sendPasswordChangeEmail(payload) {
    const changedAt = payload.changed_at || new Date().toISOString();
    return transporter.sendMail({
      from: `"DEV" <${emailEnv.EMAIL}>`,
      to: payload.email,
      subject: "Mật khẩu đã được thay đổi",
      html: `<p>Mật khẩu của bạn đã được thay đổi vào ${changedAt}</p>`,
    });
  }
}
const emailService = new EmailService();
module.exports = emailService;
