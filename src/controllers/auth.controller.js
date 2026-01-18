const authService = require("../services/auth.service");

class AuthController {
  async registerController(req, res) {
    const { email, password } = req.body;
    const clientUrl = req.headers["x-client-url"];

    const result = await authService.register({ email, password, clientUrl });
    return res.success(
      { user: result.user },
      {
        ...result.token,
      },
    );
  }

  async loginController(req, res) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return res.success(
      { user: result.user },
      {
        ...result.token,
      },
    );
  }
  async logoutController(req, res) {
    const userId = req.user.id;
    const refreshToken = req.body.refresh_token;
    const accessToken = req?.headers?.authorization?.split(" ")[1];

    await authService.logout(userId, refreshToken, accessToken);
    return res.success(null, { message: "Đăng xuất thành công" });
  }
  async refreshTokenController(req, res) {
    const userId = req.user.id;
    const refreshToken = req.body.refresh_token;
    const result = await authService.refreshToken(userId, refreshToken);
    return res.success({ result });
  }
  async verifyEmailController(req, res) {
    const token = req.body.token;
    await authService.verifyEmail(token);
    return res.success(null, { message: "Xác thực email thành công" });
  }

  async changePasswordController(req, res) {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;
    await authService.changePassword(userId, current_password, new_password);
    return res.success(null, { message: "Đổi mật khẩu thành công" });
  }
}
const authController = new AuthController();
module.exports = authController;
