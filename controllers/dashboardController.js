const User = require('../models/User');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Payment = require('../models/Payment');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalTours = await Tour.countDocuments();
    const totalRevenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    const totalPendingBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
    const totalCancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' });
    const recentUsers = await User.find().sort('-createdAt').limit(5);
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalTours,
        totalRevenue,
        totalPendingBookings,
        totalCancelledBookings,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tour', 'title')
      .sort('-createdAt')
      .limit(10);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPopularTours = async (req, res) => {
  try {
    const popularTours = await Booking.aggregate([
      { $match: { tour: { $ne: null }, bookingStatus: { $ne: 'cancelled' } } },
      { $group: { _id: '$tour', bookingsCount: { $sum: 1 }, totalRevenue: { $sum: '$finalAmount' } } },
      { $sort: { bookingsCount: -1 } },
      { $limit: 10 },
    ]);
    await Tour.populate(popularTours, { path: '_id', select: 'title slug thumbnail price destination' });
    res.status(200).json({ success: true, data: popularTours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
