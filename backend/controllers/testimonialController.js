const Testimonial = require('../models/Testimonial');

// @desc    Get approved testimonials (public)
// @route   GET /api/testimonials
// @access  Public
const getApprovedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials including unapproved (admin)
// @route   GET /api/testimonials/all
// @access  Private
const getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a testimonial (e.g. approve it)
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovedTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
