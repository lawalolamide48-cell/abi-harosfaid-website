const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    serviceType: { type: String, required: true },
    propertyType: { type: String, enum: ['Residential', 'Commercial', 'Other'], default: 'Residential' },
    address: { type: String, required: true },
    preferredDate: { type: Date },
    message: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Converted', 'Closed'],
      default: 'New',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
