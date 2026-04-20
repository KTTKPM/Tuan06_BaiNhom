class User {
  constructor(
    id,
    username,
    password,
    role,
    refreshTokenHash = null,
    refreshTokenExpiresAt = null,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role || "USER";
    this.refreshTokenHash = refreshTokenHash;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
  }
}

module.exports = User;
