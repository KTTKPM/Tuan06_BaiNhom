require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/configs/db.config');

const PORT = process.env.PORT || 8083;

// Đồng bộ Database và chạy server
sequelize.sync().then(() => {
    console.log("MariaDB đã đồng bộ hóa!");
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Order Service đang chạy tại port ${PORT}`);
    });
}).catch(err => {
    console.error("Không thể kết nối MariaDB:", err);
});