const { jwtEnv } = require("../config/jwt");
const ApiError = require("../errors/apiError");
const authModel = require("../models/user.model");
const revokedTokenModel = require("../models/revokedToken.model");
const jwtService = require("./jwt.service");
const bcrypt = require("bcrypt");
const ms = require("ms");
const revokeAccessTokenModel = require("../models/refreshAccessToken.model");
const queueModel = require("../models/queue.model");
const { TASK_NAME, QUEUE_TYPE } = require("../constant/queue");
const mappedPayloadTypeEmail = require("../utils/mapQueue");
class AuthService {
  async signFlowAuth(user) {
    const safeUser = { id: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      jwtService.sign(
        { sub: user.id },
        { expiresIn: jwtEnv.ACCESS_TOKEN_TIME },
      ),
      jwtService.signRefreshToken(),
    ]);
    await revokedTokenModel.create(
      user.id,
      jwtService.hashRefreshToken(refresh_token),
      new Date(Date.now() + ms(jwtEnv.REFRESH_TOKEN_TIME)),
    );
    await revokeAccessTokenModel.create(user.id, access_token, null);
    return {
      safeUser,
      access_token,
      refresh_token,
    };
  }

  async revokeHashRefreshToken(userId, refreshToken) {
    const hashTk = jwtService.hashRefreshToken(refreshToken);
    const result = await revokedTokenModel.revokedTokenByUser(userId, hashTk);
    return result;
  }
  async login({ email, password }) {
    const user = await authModel.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Sai tài khoản hoặc mật khẩu");
    }
    const { safeUser, access_token, refresh_token } =
      await this.signFlowAuth(user);
    return {
      user: safeUser,
      token: {
        access_token,
        refresh_token,
      },
    };
  }

  async register({ email, password, clientUrl }) {
    const existed = await authModel.findByEmailWithPassword(email);
    if (existed) {
      throw new ApiError(409, "Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await authModel.createUser({
      email,
      password: hashedPassword,
    });

    const user = await authModel.findById(userId);
    const { safeUser, access_token, refresh_token } =
      await this.signFlowAuth(user);
    await queueModel.create({
      type: QUEUE_TYPE.EMAIL,
      task_name: TASK_NAME.SEND_VERIFICATION_EMAIL,
      payload: mappedPayloadTypeEmail(user),
    });
    return {
      user: safeUser,
      token: {
        access_token,
        refresh_token,
      },
    };
  }

  async logout(userId, refreshToken, accessToken) {
    const operations = [this.revokeHashRefreshToken(userId, refreshToken)];
    if (accessToken) {
      operations.push(
        revokeAccessTokenModel.revokedTokenByUser(userId, accessToken),
      );
    }
    const [result] = await Promise.all(operations);
    return result;
  }

  async refreshToken(userId, refreshToken) {
    const user = await authModel.findById(userId);
    await revokeAccessTokenModel.revokedTokenAllByUser(user.id);
    await this.revokeHashRefreshToken(userId, refreshToken);

    const { access_token, refresh_token } = await this.signFlowAuth(user);
    return {
      access_token,
      refresh_token,
    };
  }
  async verifyEmail(token) {
    await jwtService.verify(token);
    const decode = jwtService.decode(token);

    const user = await authModel.findById(decode.sub);
    if (!user) {
      return res.error(401, "Verify thất bại");
    }
    if (user.verify_at) throw new ApiError(400, "Tài khoản đã xác minh");
    const result = await authModel.updateVerifyAtByUser(user.id);
    return result;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await authModel.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Mật khẩu hiện tại không đúng");
    }

    if (currentPassword === newPassword) {
      throw new ApiError(400, "Mật khẩu mới phải khác mật khẩu hiện tại");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authModel.updatePasswordById(user.id, hashedPassword);

    await queueModel.create({
      type: QUEUE_TYPE.EMAIL,
      task_name: TASK_NAME.SEND_PASSWORD_CHANGE_EMAIL,
      payload: JSON.stringify({
        user_id: user.id,
        email: user.email,
        changed_at: new Date().toISOString(),
      }),
    });
    return true;
  }
}

module.exports = new AuthService();
