const axios = require('axios');
const db = require('../config/db'); // Sử dụng lại kết nối DB
const { ORDER_SERVICE_URL } = require('../config/constants');
const { sendNotification } = require('./notificationService');

const processPayment = async (paymentData) => {
    const { orderId, customerName, paymentMethod } = paymentData;

    try {
        // 1. Gọi Order Service cập nhật trạng thái bên máy Người 4
        //
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}`, {
            status: "PAID"
        });

        // 2. Lưu lịch sử vào MariaDB
        //
        const sql = `INSERT INTO payments (order_id, customer_name, payment_method, status) VALUES (?, ?, ?, ?)`;
        await db.execute(sql, [orderId, customerName, paymentMethod, 'SUCCESS']);

        // 3. Gửi thông báo ra console
        //
        const notice = sendNotification(customerName, orderId);

        return { 
            success: true, 
            message: notice, 
            dbStatus: "Saved to MariaDB Successfully" 
        };
    } catch (error) {
        console.error("Lỗi:", error.message);
        throw new Error("Thanh toán thất bại: " + error.message);
    }
};

module.exports = { processPayment };