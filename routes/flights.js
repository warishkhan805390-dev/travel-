const express = require('express');
const router = express.Router();
const {
  searchFlights,
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
} = require('../controllers/flightController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchFlights);
router.get('/:id', getFlight);
router.get('/', getFlights);
router.post('/', protect, authorize('admin'), createFlight);
router.put('/:id', protect, authorize('admin'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

module.exports = router;
