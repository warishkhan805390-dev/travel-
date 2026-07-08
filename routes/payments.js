const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getUserPayments,
  getAllPayments,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/admin', protect, authorize('admin'), getAllPayments);
router.get('/', protect, getUserPayments);

module.exports = router;
