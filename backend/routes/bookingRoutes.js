const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  checkAvailability,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', createBooking);
router.get('/availability', checkAvailability);
router.get('/', protect, getBookings);
router.patch('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
