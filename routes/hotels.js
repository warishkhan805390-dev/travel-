const express = require('express');
const router = express.Router();
const {
  searchHotels,
  getHotels,
  getFeaturedHotels,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
  uploadHotelImages,
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', searchHotels);
router.get('/featured', getFeaturedHotels);
router.get('/:slug', getHotelBySlug);
router.get('/', getHotels);
router.put('/upload-images/:id', protect, authorize('admin'), upload.array('images', 10), uploadHotelImages);
router.post('/', protect, authorize('admin'), createHotel);
router.put('/:id', protect, authorize('admin'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

module.exports = router;
