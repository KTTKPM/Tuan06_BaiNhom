const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { localPayments } = require('../services/paymentService');

router.post('/payments', paymentController.handlePayment);

// Thêm route này để test xem dữ liệu local
router.get('/payments/history', (req, res) => {
    res.json(localPayments);
});

module.exports = router;