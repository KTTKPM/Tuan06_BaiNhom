const pool = require("../config/dbConfig");

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    refreshTokenHash: row.refreshTokenHash ?? row.refresh_token_hash ?? null,
    refreshTokenExpiresAt:
      row.refreshTokenExpiresAt ?? row.refresh_token_expires_at ?? null,
  };
}

class UserRepository {
  async findAll() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT id, username, role FROM users");
      return rows;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async findByUsername(username) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        `
                SELECT
                    id,
                    username,
                    password,
                    role,
                    refresh_token_hash AS refreshTokenHash,
                    refresh_token_expires_at AS refreshTokenExpiresAt
                FROM users
                WHERE username = ?
                `,
        [username],
      );

      return mapUserRow(rows[0]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async findById(id) {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(
        `
                SELECT
                    id,
                    username,
                    password,
                    role,
                    refresh_token_hash AS refreshTokenHash,
                    refresh_token_expires_at AS refreshTokenExpiresAt
                FROM users
                WHERE id = ?
                `,
        [id],
      );

      return mapUserRow(rows[0]);
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async save(user) {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [user.username, user.password, user.role],
      );
      return { id: Number(result.insertId), ...user };
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async updateRefreshToken(userId, refreshTokenHash, refreshTokenExpiresAt) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        `
                UPDATE users
                SET refresh_token_hash = ?, refresh_token_expires_at = ?
                WHERE id = ?
                `,
        [refreshTokenHash, refreshTokenExpiresAt, userId],
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  async revokeRefreshToken(userId) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        `
                UPDATE users
                SET refresh_token_hash = NULL, refresh_token_expires_at = NULL
                WHERE id = ?
                `,
        [userId],
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new UserRepository();
