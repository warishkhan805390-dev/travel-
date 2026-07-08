const express = require('express');
const router = express.Router();
const {
  addReview,
  getTourReviews,
  getHotelReviews,
  updateReview,
  deleteReview,
  approveReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/tour/:tourId', getTourReviews);
router.get('/hotel/:hotelId', getHotelReviews);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/', protect, addReview);

module.exports = router;
