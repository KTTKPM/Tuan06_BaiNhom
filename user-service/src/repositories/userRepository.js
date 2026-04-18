const pool = require('../config/dbConfig');

class UserRepository {
    async findAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT id, username, role FROM users");
            return rows;
        } catch (err) { throw err; }
        finally { if (conn) conn.release(); }
    }

    async findByUsername(username) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM users WHERE username = ?", [username]);
            return rows[0]; 
        } catch (err) { throw err; }
        finally { if (conn) conn.release(); }
    }

    async save(user) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                [user.username, user.password, user.role]
            );
            return { id: Number(result.insertId), ...user };
        } catch (err) { throw err; }
        finally { if (conn) conn.release(); }
    }
}

module.exports = new UserRepository();