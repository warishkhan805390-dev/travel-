const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  cancelBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin'), getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);

module.exports = router;
