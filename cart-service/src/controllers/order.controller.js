const Order = require('../models/order.model');

// POST /order - Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    try {
        const { userId, totalAmount } = req.body;
        if (!userId || !totalAmount) {
            return res.status(400).json({ error: 'userId và totalAmount là bắt buộc' });
        }

        const newOrder = await Order.create({
            userId,
            totalAmount,
            status: 'PENDING'
        });

        res.status(201).json({ message: 'Tạo đơn hàng thành công', data: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /order - Lấy danh sách đơn hàng (có thể lọc theo userId)
exports.getOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        let orders;
        if (userId) {
            orders = await Order.findAll({ where: { userId } });
        } else {
            orders = await Order.findAll();
        }
        res.json({ orders, total: orders.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /order/:id - Lấy chi tiết 1 đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
