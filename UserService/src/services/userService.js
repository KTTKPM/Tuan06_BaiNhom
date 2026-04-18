const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/jwtConfig');

class UserService {
    async register(userData) {
        const { username, password, role } = userData;
        
        // PHẢI có await ở đây
        const existing = await userRepository.findByUsername(username);
        if (existing) throw new Error("Tên đăng nhập đã tồn tại!");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword, role: role || 'USER' };

        return await userRepository.save(newUser);
    }

    async login(username, password) {
        const user = await userRepository.findByUsername(username);
        if (!user) throw new Error("Người dùng không tồn tại!");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Mật khẩu không chính xác!");

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            config.secret,
            { expiresIn: config.expiresIn }
        );

        return { token, user };
    }

    async getAll() {
        return await userRepository.findAll();
    }
}

module.exports = new UserService();