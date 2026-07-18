const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientRole: { type: String, default: '' }, // e.g. "Office Manager, Victoria Island"
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: false }, // only approved testimonials show on the public site
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
