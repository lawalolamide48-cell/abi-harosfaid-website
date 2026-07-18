# ABI Harosfaid Limited — Full-Stack Website

A complete cleaning & facility management website: public frontend, admin dashboard, and Node.js/Express/MongoDB backend.

## What's included

```
harosfaid-website/
├── backend/          Node.js + Express + MongoDB API
├── frontend/         Public website (index, about, services, gallery, contact)
└── admin/            Admin dashboard (login + management panel)
```

**Backend features:** JWT admin auth, quote requests, bookings with time-slot availability, testimonials, gallery, contact messages, email notifications (Nodemailer), rate limiting, dashboard stats.

**Frontend:** Fully responsive, brand colors pulled from your logo, WhatsApp integration, dynamic content (services/testimonials/gallery load from the API), 3-in-1 contact form (Quote / Booking / Message tabs).

**Admin dashboard:** Login-protected. Manage quote requests, bookings (status + staff assignment), testimonials (approve before they go live), gallery images, services, and contact messages — all from one place.

---

## 1. Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- **MONGO_URI** — get a free connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier / M0 is enough)
- **JWT_SECRET** — any long random string
- **ADMIN_EMAIL / ADMIN_PASSWORD** — your login for the admin dashboard
- **EMAIL_USER / EMAIL_PASS** — optional, for email notifications on new quotes/bookings. For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) (not your normal password)

Then seed the database (creates your admin account + the 5 starter services):

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

The server runs on `http://localhost:5000` and **also serves the frontend and admin folders** — so visiting `http://localhost:5000` shows the website, and `http://localhost:5000/admin/login.html` shows the admin login.

### Login to the admin dashboard

Go to `http://localhost:5000/admin/login.html` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

---

## 2. Deployment (recommended: single service)

The simplest path is deploying the whole `backend/` folder (which also serves `frontend/` and `admin/`) as one service:

1. **Render.com** or **Railway.app** (both have free/cheap tiers):
   - Create a new Web Service, point it at this repo/folder
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add all the environment variables from your `.env` file
2. Once deployed, your whole site (frontend + admin + API) is live on one URL.

### Alternative: separate frontend hosting (e.g. GitHub Pages)

If you prefer to host the frontend separately:
1. Deploy `backend/` to Render/Railway as above
2. In `frontend/js/config.js`, change:
   ```js
   const API_BASE_URL = '/api';
   ```
   to your deployed backend URL, e.g.:
   ```js
   const API_BASE_URL = 'https://your-backend.onrender.com/api';
   ```
3. Push `frontend/` to GitHub Pages (same way you deployed your portfolio)
4. In the backend's `.env`, set `CLIENT_URL` to your GitHub Pages URL

---

## 3. Adding real content

Right now the site shows placeholder gallery images and no testimonials (both display friendly "coming soon" placeholders until you add real ones). To populate them:

1. Log into the admin dashboard
2. **Gallery** → Add Image → paste an image URL (upload photos to a free host like [Cloudinary](https://cloudinary.com) or [Imgur](https://imgur.com) first, then paste the direct image link here)
3. **Testimonials** → Add Testimonial → check "Approved" to make it go live on the homepage immediately

---

## 4. Customizing

- **Colors**: all defined as CSS variables at the top of `frontend/css/style.css` (`--blue-brand`, `--blue-action`, etc.) — change once, applies everywhere
- **Tagline**: edit the `<h1>` in `frontend/index.html`'s hero section
- **Services**: edit directly from the admin dashboard, or update the seed list in `backend/seed/seed.js`
- **Contact info**: `frontend/js/config.js` (`COMPANY` object) — also update the footer HTML on each page if you change it

---

## 5. Notes

- Bookings check real-time slot availability (Morning / Afternoon / Evening) against existing bookings for the selected date — no double-booking.
- Public API rate-limited to 20 requests per 15 minutes per IP on the contact/quote/booking forms to prevent spam.
- Admin passwords are hashed with bcrypt; sessions use JWT (7-day expiry by default).
