const express = require('express');
const router = express.Router();
const {
  getTours,
  getFeaturedTours,
  getPopularTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
  uploadTourImages,
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/featured', getFeaturedTours);
router.get('/popular', getPopularTours);
router.get('/:slug', getTourBySlug);
router.get('/', getTours);
router.put('/upload-images/:id', protect, authorize('admin'), upload.array('images', 10), uploadTourImages);
router.post('/', protect, authorize('admin'), createTour);
router.put('/:id', protect, authorize('admin'), updateTour);
router.delete('/:id', protect, authorize('admin'), deleteTour);

module.exports = router;
