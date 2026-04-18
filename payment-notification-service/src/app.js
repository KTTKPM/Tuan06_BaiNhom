const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/constants');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Payment Service is Running!');
});

app.use('/api', paymentRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Payment Service đã sẵn sàng tại port ${PORT}`);
});