require("dotenv").config();

const refreshTokenTtlMs = Number(
  process.env.JWT_REFRESH_TTL_MS || 7 * 24 * 60 * 60 * 1000,
);

const refreshCookieSecure =
  String(process.env.JWT_REFRESH_COOKIE_SECURE || "false").toLowerCase() ===
  "true";

module.exports = {
  accessTokenSecret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  refreshTokenTtlMs,
  refreshCookieName:
    process.env.JWT_REFRESH_COOKIE_NAME || "mfos_refresh_token",
  refreshCookiePath: process.env.JWT_REFRESH_COOKIE_PATH || "/api/users",
  refreshCookieSameSite: process.env.JWT_REFRESH_COOKIE_SAMESITE || "lax",
  refreshCookieSecure,
};
