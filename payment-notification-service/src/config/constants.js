module.exports = {
  PORT: Number(process.env.PORT || 8084),
  ORDER_SERVICE_URL:
    process.env.ORDER_SERVICE_URL || "http://127.0.0.1:8083/order",
};
