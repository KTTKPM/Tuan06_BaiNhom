const jwt = require('jsonwebtoken');
const config = require('../config/jwtConfig');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để thực hiện" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }
        req.user = decoded; 
        next();
    });
};