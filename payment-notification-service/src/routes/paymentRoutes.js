const express = require("express");
const router = express.Router();
const db = require("../config/db");
const paymentController = require("../controllers/paymentController");

router.post("/payments", paymentController.handlePayment);

async function handlePaymentHistory(req, res) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM payments ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

router.get("/history", handlePaymentHistory);
router.get("/payments/history", handlePaymentHistory);

module.exports = router;
