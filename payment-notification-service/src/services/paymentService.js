const axios = require('axios');
// const db = require('../config/db'); // XÓA DÒNG NÀY
const { ORDER_SERVICE_URL } = require('../config/constants');
const { sendNotification } = require('./notificationService');

// Khởi tạo mảng lưu trữ local thay cho Database
const localPayments = [];

const processPayment = async (paymentData) => {
    const { orderId, customerName, paymentMethod } = paymentData;

    try {
        // 1. Gọi Order Service để cập nhật trạng thái 
        //
        await axios.put(`${ORDER_SERVICE_URL}/${orderId}`, {
            status: "PAID"
        });

        // 2. Lưu lịch sử vào mảng Local 
        const newPayment = {
            id: localPayments.length + 1,
            orderId,
            customerName,
            paymentMethod,
            status: 'SUCCESS',
            createdAt: new Date()
        };
        localPayments.push(newPayment);
        
        console.log("✅ Đã lưu thanh toán vào bộ nhớ Local:", newPayment);

        // 3. Gửi thông báo
        //
        const notice = sendNotification(customerName, orderId);

        return { 
            success: true, 
            message: notice, 
            dbStatus: "Saved to Local Memory (No DB)",
            data: newPayment 
        };
    } catch (error) {
        console.error("Lỗi:", error.message);
        throw new Error("Thanh toán thất bại: " + error.message);
    }
};

module.exports = { processPayment, localPayments };