const paymentService = require('../services/paymentService');

const handlePayment = async (req, res) => {
    try {
        const result = await paymentService.processPayment(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { handlePayment };