const express = require('express');
const router = express.Router();
const {
  getStats,
  getRevenue,
  getRecentBookings,
  getPopularTours,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/revenue', protect, authorize('admin'), getRevenue);
router.get('/recent-bookings', protect, authorize('admin'), getRecentBookings);
router.get('/popular-tours', protect, authorize('admin'), getPopularTours);

module.exports = router;
