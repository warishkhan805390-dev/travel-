const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const errorHandler = require('./middleware/error');
const dns = require('dns');
dns.setServers(["8.8.8.8", "0.0.0.0"]);


dotenv.config();

connectDB();
configureCloudinary();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api', limiter);

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  require('./controllers/paymentController').stripeWebhook
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tours', require('./routes/tours'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Travel Booking API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// process.on('unhandledRejection', (err) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });

process.on('unhandledRejection', (err) => {
  console.log(err);
  server.close(() => process.exit(1));
});

module.exports = app;
