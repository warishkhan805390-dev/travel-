const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { bookingId: bookingId.toString() },
    });
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, transactionId, paymentMethod } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    await booking.save();
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: booking.finalAmount,
      paymentMethod: paymentMethod || 'stripe',
      transactionId: transactionId || 'manual',
      status: 'completed',
    });
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('booking')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments();

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    }
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed';
        await booking.save();
        await Payment.create({
          booking: bookingId,
          user: booking.user,
          amount: paymentIntent.amount / 100,
          transactionId: paymentIntent.id,
          status: 'completed',
        });
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
