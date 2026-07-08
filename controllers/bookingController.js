const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Tour = require('../models/Tour');
const { sendBookingConfirmation } = require('../utils/email');

exports.createBooking = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const booking = await Booking.create(req.body);
    if (booking.tour) {
      await Tour.findByIdAndUpdate(booking.tour, {
        $inc: { ratingsQuantity: 0 },
      });
    }
    await Notification.create({
      user: req.user.id,
      title: 'Booking Confirmed',
      message: `Your ${booking.bookingType} booking has been confirmed. Booking ID: ${booking._id}`,
      type: 'booking',
      relatedId: booking._id,
    });
    try {
      await sendBookingConfirmation(req.user, booking);
    } catch (err) {
      console.log('Booking confirmation email failed');
    }
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('tour', 'title slug thumbnail price destination')
      .populate('hotel', 'name slug thumbnail price')
      .populate('flight', 'airline flightNumber departureCity arrivalCity date price')
      .populate('car', 'name brand model pricePerDay')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('tour', 'title slug price')
      .populate('hotel', 'name slug price')
      .populate('flight', 'airline flightNumber price')
      .populate('car', 'name brand pricePerDay')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments();

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('tour')
      .populate('hotel')
      .populate('flight')
      .populate('car')
      .populate('coupon');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    await booking.save();
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your ${booking.bookingType} booking (ID: ${booking._id}) has been cancelled.`,
      type: 'booking',
      relatedId: booking._id,
    });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
