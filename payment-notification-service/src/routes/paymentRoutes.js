const express = require('express');
const router = express.Router();
const db = require('../config/db');
const paymentController = require('../controllers/paymentController');
const { localPayments } = require('../services/paymentService');

router.post('/payments', paymentController.handlePayment);

router.get('/history', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM payments ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;