const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    serviceType: { type: String, required: true },
    address: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    timeSlot: {
      type: String,
      enum: ['Morning (8am - 12pm)', 'Afternoon (12pm - 4pm)', 'Evening (4pm - 7pm)'],
      required: true,
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    assignedStaff: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
