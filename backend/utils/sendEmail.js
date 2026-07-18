const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

// Sends an email. Never throws - logs and swallows errors so a failed email
// notification never breaks the actual quote/booking submission for the customer.
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured - skipping send. Set EMAIL_USER/EMAIL_PASS in .env');
    return;
  }
  try {
    await getTransporter().sendMail({
      from: `"ABI Harosfaid Limited" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

module.exports = sendEmail;
