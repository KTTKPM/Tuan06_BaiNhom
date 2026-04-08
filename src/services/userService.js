const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/jwtConfig');

class UserService {
    async register(userData) {
        const { username, password, role } = userData;
        
        if (userRepository.findByUsername(username)) {
            throw new Error("Tên đăng nhập đã tồn tại!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            username,
            password: hashedPassword,
            role: role || 'USER'
        };

        return userRepository.save(newUser);
    }

    async login(username, password) {
        const user = userRepository.findByUsername(username);
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

    getAll() {
        return userRepository.findAll();
    }
}

module.exports = new UserService();