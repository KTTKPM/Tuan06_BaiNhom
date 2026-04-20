const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/jwtConfig");

class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

function hashToken(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

class UserService {
  assertJwtConfig() {
    if (!config.accessTokenSecret || !config.refreshTokenSecret) {
      throw new Error("Thiếu cấu hình JWT_SECRET hoặc JWT_REFRESH_SECRET");
    }
  }

  issueAccessToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.accessTokenSecret,
      { expiresIn: config.accessTokenExpiresIn },
    );
  }

  issueRefreshToken(user) {
    return jwt.sign({ id: user.id }, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiresIn,
    });
  }

  async saveRefreshToken(userId, refreshToken) {
    const refreshTokenHash = hashToken(refreshToken);
    const refreshTokenExpiresAt = new Date(
      Date.now() + config.refreshTokenTtlMs,
    );

    await userRepository.updateRefreshToken(
      userId,
      refreshTokenHash,
      refreshTokenExpiresAt,
    );
  }

  async register(userData) {
    const { username, password, role } = userData;

    // PHẢI có await ở đây
    const existing = await userRepository.findByUsername(username);
    if (existing) throw new Error("Tên đăng nhập đã tồn tại!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      role: role || "USER",
    };

    return await userRepository.save(newUser);
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error("Người dùng không tồn tại!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Mật khẩu không chính xác!");

    this.assertJwtConfig();

    const accessToken = this.issueAccessToken(user);
    const refreshToken = this.issueRefreshToken(user);

    await this.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AuthError("Thiếu refresh token", 401);
    }

    this.assertJwtConfig();

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
    } catch (error) {
      throw new AuthError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
    }

    const userId = decoded?.id;
    if (!userId) {
      throw new AuthError("Refresh token không hợp lệ", 401);
    }

    const user = await userRepository.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new AuthError("Refresh token đã bị thu hồi", 401);
    }

    const currentHash = hashToken(refreshToken);
    if (currentHash !== user.refreshTokenHash) {
      await userRepository.revokeRefreshToken(userId);
      throw new AuthError("Refresh token không hợp lệ", 401);
    }

    if (
      user.refreshTokenExpiresAt &&
      new Date(user.refreshTokenExpiresAt).getTime() <= Date.now()
    ) {
      await userRepository.revokeRefreshToken(userId);
      throw new AuthError("Refresh token đã hết hạn", 401);
    }

    const accessToken = this.issueAccessToken(user);
    const newRefreshToken = this.issueRefreshToken(user);

    await this.saveRefreshToken(userId, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  async logout(userId) {
    if (!userId) {
      throw new AuthError("Không tìm thấy thông tin người dùng đăng nhập", 401);
    }

    await userRepository.revokeRefreshToken(userId);
    return { success: true };
  }

  async getAll() {
    return await userRepository.findAll();
  }
}

module.exports = new UserService();
