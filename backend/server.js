require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow your deployed frontend + local dev
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5500', 'http://127.0.0.1:5500'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // keep permissive by default; tighten in production if needed
      }
    },
    credentials: true,
  })
);

// Basic rate limiting on public form endpoints to prevent spam/abuse
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests from this device. Please try again later.' },
});
app.use('/api/quotes', formLimiter);
app.use('/api/bookings', formLimiter);
app.use('/api/contact', formLimiter);

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ABI Harosfaid API is running' });
});

// Optional: serve the static frontend & admin folders from this same server,
// so you can deploy everything as a single service (simplest option on Render/Railway).
// Comment this block out if you prefer to host the frontend separately (e.g. GitHub Pages).
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ABI Harosfaid server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
