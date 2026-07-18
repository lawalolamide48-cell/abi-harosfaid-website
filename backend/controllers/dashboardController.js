const QuoteRequest = require('../models/QuoteRequest');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get summary stats for the admin dashboard
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const [
      newQuotes,
      totalQuotes,
      upcomingBookings,
      totalBookings,
      unreadMessages,
      recentQuotes,
      recentBookings,
    ] = await Promise.all([
      QuoteRequest.countDocuments({ status: 'New' }),
      QuoteRequest.countDocuments(),
      Booking.countDocuments({ scheduledDate: { $gte: new Date() }, status: { $ne: 'Cancelled' } }),
      Booking.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      QuoteRequest.find().sort({ createdAt: -1 }).limit(5),
      Booking.find().sort({ scheduledDate: 1 }).limit(5),
    ]);

    res.json({
      newQuotes,
      totalQuotes,
      upcomingBookings,
      totalBookings,
      unreadMessages,
      recentQuotes,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
