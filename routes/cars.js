const express = require('express');
const router = express.Router();
const {
  searchCars,
  getCars,
  getFeaturedCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchCars);
router.get('/featured', getFeaturedCars);
router.get('/:id', getCar);
router.get('/', getCars);
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

module.exports = router;
