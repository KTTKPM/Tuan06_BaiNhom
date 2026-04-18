const express = require('express');
const cors = require('cors');
const userController = require('./controllers/userController');
const globalErrorHandler = require('./exceptions/globalExceptionHandler');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/users', userController);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 8081;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------`);
    console.log(`USER SERVICE đang chạy tại cổng: ${PORT}`);
    console.log(`Link test: http://localhost:${PORT}/api/users`);
    console.log(`-----------------------------------------`);
});