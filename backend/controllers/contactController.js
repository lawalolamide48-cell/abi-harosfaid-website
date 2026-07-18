const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required' });
    }

    const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });

    sendEmail({
      to: process.env.NOTIFY_EMAIL,
      subject: `New Contact Message: ${subject || 'General Inquiry'}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(201).json({ message: 'Message sent successfully', contactMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a contact message as read
// @route   PATCH /api/contact/:id
// @access  Private
const updateContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private
const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
};
