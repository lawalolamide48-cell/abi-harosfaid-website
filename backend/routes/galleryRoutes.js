const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

router.get('/', getGalleryImages);
router.post('/', protect, addGalleryImage);
router.put('/:id', protect, updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
