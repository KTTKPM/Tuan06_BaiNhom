const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authFilter = require('../filters/authFilter');
const { UserResponseDTO } = require('../dto/userDto');

router.post('/register', async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json({
            message: "Đăng ký thành công",
            data: new UserResponseDTO(user)
        });
    } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await userService.login(username, password);
        res.json({
            token: result.token,
            user: new UserResponseDTO(result.user)
        });
    } catch (error) { next(error); }
});

router.get('/', authFilter, async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.json(users.map(u => new UserResponseDTO(u)));
    } catch (error) { next(error); }
});

module.exports = router;