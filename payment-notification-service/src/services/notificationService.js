const sendNotification = (customerName, orderId) => {
    const message = `[THÔNG BÁO]: Khách hàng ${customerName} đã đặt đơn #${orderId} thành công!`;
    console.log(message);

    return message;
};

module.exports = { sendNotification };