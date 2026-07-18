const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const { name, phone, email, serviceType, address, scheduledDate, timeSlot, notes } = req.body;

    if (!name || !phone || !serviceType || !address || !scheduledDate || !timeSlot) {
      return res.status(400).json({
        message: 'Name, phone, service type, address, date, and time slot are required',
      });
    }

    const booking = await Booking.create({
      name,
      phone,
      email,
      serviceType,
      address,
      scheduledDate,
      timeSlot,
      notes,
    });

    sendEmail({
      to: process.env.NOTIFY_EMAIL,
      subject: `New Booking from ${name}`,
      html: `
        <h2>New Cleaning Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Date:</strong> ${new Date(scheduledDate).toDateString()}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
      `,
    });

    res.status(201).json({ message: 'Booking submitted successfully', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin, supports ?status= and ?date= filters)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) {
      const start = new Date(req.query.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(req.query.date);
      end.setHours(23, 59, 59, 999);
      filter.scheduledDate = { $gte: start, $lte: end };
    }
    const bookings = await Booking.find(filter).sort({ scheduledDate: 1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Check which time slots are already taken on a given date
// @route   GET /api/bookings/availability?date=YYYY-MM-DD
// @access  Public
const checkAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      scheduledDate: { $gte: start, $lte: end },
      status: { $ne: 'Cancelled' },
    }).select('timeSlot');

    const takenSlots = bookings.map((b) => b.timeSlot);
    const allSlots = ['Morning (8am - 12pm)', 'Afternoon (12pm - 4pm)', 'Evening (4pm - 7pm)'];
    const availableSlots = allSlots.filter((slot) => !takenSlots.includes(slot));

    res.json({ date, availableSlots, takenSlots });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a booking (status / notes / assigned staff)
// @route   PATCH /api/bookings/:id
// @access  Private
const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  checkAvailability,
  updateBooking,
  deleteBooking,
};
