const GalleryImage = require('../models/GalleryImage');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a gallery image (by URL - e.g. from Cloudinary/Imgur, or your own hosting)
// @route   POST /api/gallery
// @access  Private
const addGalleryImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.create(req.body);
    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a gallery image
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage };
