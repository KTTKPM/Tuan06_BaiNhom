const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'food_system',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();






// CREATE TABLE payments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     order_id INT NOT NULL,
//     customer_name VARCHAR(255),
//     payment_method VARCHAR(50),
//     status VARCHAR(50),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );