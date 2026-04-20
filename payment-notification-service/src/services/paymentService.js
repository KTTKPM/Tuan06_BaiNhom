const axios = require("axios");
const db = require("../config/db"); // Sử dụng lại kết nối DB
const { ORDER_SERVICE_URL } = require("../config/constants");
const { sendNotification } = require("./notificationService");

const createServiceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const processPayment = async (paymentData) => {
  const { orderId, customerName, paymentMethod } = paymentData;

  if (typeof orderId === "undefined" || orderId === null || orderId === "") {
    throw createServiceError("orderId là bắt buộc", 400);
  }

  if (!paymentMethod) {
    throw createServiceError("paymentMethod là bắt buộc", 400);
  }

  const resolvedCustomerName = customerName || "Unknown";

  try {
    // 1. Gọi Order Service cập nhật trạng thái bên máy Người 4
    //
    const orderUpdateResponse = await axios.put(
      `${ORDER_SERVICE_URL}/${orderId}`,
      {
        status: "PAID",
      },
    );

    const updatedOrder =
      orderUpdateResponse?.data?.data || orderUpdateResponse?.data || null;

    if (!updatedOrder) {
      throw createServiceError(
        "Không nhận được dữ liệu đơn hàng sau khi cập nhật trạng thái",
        502,
      );
    }

    // 2. Lưu lịch sử vào MariaDB
    //
    const sql = `INSERT INTO payments (order_id, customer_name, payment_method, status) VALUES (?, ?, ?, ?)`;
    const [insertResult] = await db.execute(sql, [
      orderId,
      resolvedCustomerName,
      paymentMethod,
      "SUCCESS",
    ]);

    // 3. Gửi thông báo ra console
    //
    const notice = sendNotification(resolvedCustomerName, orderId);

    return {
      success: true,
      message: notice,
      dbStatus: "Saved to MariaDB Successfully",
      payment: {
        id: insertResult.insertId,
        orderId,
        customerName: resolvedCustomerName,
        paymentMethod,
        status: "SUCCESS",
      },
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Lỗi:", error.message);

    if (error.statusCode) {
      throw error;
    }

    const upstreamStatusCode = error.response?.status;
    if (
      upstreamStatusCode &&
      upstreamStatusCode >= 400 &&
      upstreamStatusCode < 500
    ) {
      throw createServiceError(
        `Thanh toán thất bại: ${error.message}`,
        upstreamStatusCode,
      );
    }

    throw createServiceError("Thanh toán thất bại: " + error.message, 500);
  }
};

module.exports = { processPayment };
