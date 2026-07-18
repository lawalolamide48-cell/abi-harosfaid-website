const QuoteRequest = require('../models/QuoteRequest');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a quote request
// @route   POST /api/quotes
// @access  Public
const createQuoteRequest = async (req, res, next) => {
  try {
    const { name, phone, email, serviceType, propertyType, address, preferredDate, message } = req.body;

    if (!name || !phone || !serviceType || !address) {
      return res.status(400).json({ message: 'Name, phone, service type, and address are required' });
    }

    const quote = await QuoteRequest.create({
      name,
      phone,
      email,
      serviceType,
      propertyType,
      address,
      preferredDate,
      message,
    });

    // Notify the business
    sendEmail({
      to: process.env.NOTIFY_EMAIL,
      subject: `New Quote Request from ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Property Type:</strong> ${propertyType || 'Not specified'}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate || 'Not specified'}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `,
    });

    res.status(201).json({ message: 'Quote request submitted successfully', quote });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quote requests (admin, supports ?status= filter)
// @route   GET /api/quotes
// @access  Private
const getQuoteRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const quotes = await QuoteRequest.find(filter).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a quote request (status / notes)
// @route   PATCH /api/quotes/:id
// @access  Private
const updateQuoteRequest = async (req, res, next) => {
  try {
    const quote = await QuoteRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!quote) return res.status(404).json({ message: 'Quote request not found' });
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a quote request
// @route   DELETE /api/quotes/:id
// @access  Private
const deleteQuoteRequest = async (req, res, next) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote request not found' });
    res.json({ message: 'Quote request removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createQuoteRequest, getQuoteRequests, updateQuoteRequest, deleteQuoteRequest };
