const bcrypt = require("bcryptjs");
const pool = require("./dbConfig");

const DEFAULT_USERS = [
  { username: "user", password: "user", role: "USER" },
  { username: "admin", password: "admin", role: "ADMIN" },
];

async function initializeUsers() {
  let conn;

  try {
    conn = await pool.getConnection();

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER'
      )
    `);

    const rows = await conn.query("SELECT COUNT(*) AS total FROM users");
    const totalUsers = Number(rows?.[0]?.total ?? 0);

    if (totalUsers > 0) {
      console.log("[user-service] users table already has data. Skip seeding.");
      return;
    }

    for (const user of DEFAULT_USERS) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await conn.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [user.username, hashedPassword, user.role],
      );
    }

    console.log("[user-service] seeded default users: user, admin.");
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

module.exports = { initializeUsers };
