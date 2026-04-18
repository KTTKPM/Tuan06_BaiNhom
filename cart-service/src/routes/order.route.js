const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// POST /order - Tạo đơn hàng
router.post('/', orderController.createOrder);

// GET /order - Lấy danh sách đơn hàng
router.get('/', orderController.getOrders);

// GET /order/:id - Lấy chi tiết đơn hàng
router.get('/:id', orderController.getOrderById);

module.exports = router;
