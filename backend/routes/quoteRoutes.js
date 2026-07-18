const express = require('express');
const router = express.Router();
const {
  createQuoteRequest,
  getQuoteRequests,
  updateQuoteRequest,
  deleteQuoteRequest,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');

router.post('/', createQuoteRequest);
router.get('/', protect, getQuoteRequests);
router.patch('/:id', protect, updateQuoteRequest);
router.delete('/:id', protect, deleteQuoteRequest);

module.exports = router;
