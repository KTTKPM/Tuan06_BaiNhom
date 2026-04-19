const paymentService = require("../services/paymentService");

const handlePayment = async (req, res) => {
  try {
    const result = await paymentService.processPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Thanh toán thất bại",
    });
  }
};

module.exports = { handlePayment };
