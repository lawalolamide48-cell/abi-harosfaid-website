// ==========================================================================
// API client - talks to the ABI Harosfaid backend
// ==========================================================================

const api = {
  async request(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }
    return data;
  },

  getServices() {
    return this.request('/services');
  },

  getTestimonials() {
    return this.request('/testimonials');
  },

  getGallery() {
    return this.request('/gallery');
  },

  checkAvailability(date) {
    return this.request(`/bookings/availability?date=${date}`);
  },

  submitQuote(payload) {
    return this.request('/quotes', { method: 'POST', body: JSON.stringify(payload) });
  },

  submitBooking(payload) {
    return this.request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
  },

  submitContact(payload) {
    return this.request('/contact', { method: 'POST', body: JSON.stringify(payload) });
  },
};

// Fallback content shown if the backend isn't reachable yet (e.g. before deployment),
// so the site never looks broken or empty. Mirrors backend/seed/seed.js.
const FALLBACK_SERVICES = [
  { name: 'Office & Commercial Cleaning', slug: 'office-commercial-cleaning', shortDescription: 'Daily, weekly, or one-off cleaning for offices, shops, and commercial spaces.', icon: 'briefcase' },
  { name: 'Residential Cleaning', slug: 'residential-cleaning', shortDescription: 'Regular home cleaning for apartments, duplexes, and family houses.', icon: 'home' },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', shortDescription: 'A thorough, top-to-bottom clean for spaces that need extra attention.', icon: 'sparkles' },
  { name: 'Post-Construction Cleanup', slug: 'post-construction-cleanup', shortDescription: 'Dust, debris, and residue removal after renovation or building work.', icon: 'hard-hat' },
  { name: 'Fumigation & Pest Control', slug: 'fumigation-pest-control', shortDescription: 'Safe, effective treatment to keep your space pest-free.', icon: 'shield' },
];
