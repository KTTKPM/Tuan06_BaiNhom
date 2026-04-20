const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "payment_user",
  password: process.env.DB_PASS || "payment_pass",
  database: process.env.DB_NAME || "food_system",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();

// CREATE TABLE IF NOT EXISTS payments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     order_id INT NOT NULL,
//     customer_name VARCHAR(255),
//     payment_method VARCHAR(50),
//     status VARCHAR(50),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
