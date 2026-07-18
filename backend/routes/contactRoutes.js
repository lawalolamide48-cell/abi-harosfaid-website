const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', createContactMessage);
router.get('/', protect, getContactMessages);
router.patch('/:id', protect, updateContactMessage);
router.delete('/:id', protect, deleteContactMessage);

module.exports = router;
