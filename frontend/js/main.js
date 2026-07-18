// ==========================================================================
// ABI Harosfaid — main.js
// Handles navigation, icons, scroll reveals, dynamic content, and forms.
// ==========================================================================

/* ---------- Icon set (inline SVG, stroke = currentColor) ---------- */
const ICONS = {
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  'hard-hat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18h16"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M11 6v4M9 4h6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5C11 9.6 10.5 8.3 10.3 7.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.2-.2-.5-.3z"/><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  'arrow-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  'chevron-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>',
  'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>',
  'map-pin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5c0 8.3 6.7 15 15 15l3-3-5-4-2 2a12 12 0 0 1-6-6l2-2-4-5-3 3z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
};

function icon(name) {
  return ICONS[name] || ICONS.sparkles;
}

/* ---------- Mobile nav ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.innerHTML = links.classList.contains('open') ? icon('close') : icon('menu');
  });
  toggle.innerHTML = icon('menu');

  // Highlight current page in nav
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- WhatsApp links ---------- */
function initWhatsApp() {
  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    const msg = el.getAttribute('data-whatsapp-message') || undefined;
    el.href = buildWhatsAppLink(COMPANY.whatsappPrimary, msg);
    el.target = '_blank';
    el.rel = 'noopener';
  });
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.getAttribute('data-icon'));
  });
}

/* ---------- Scroll reveal ---------- */
function initWipeReveal() {
  const targets = document.querySelectorAll('.wipe-reveal:not(.is-visible)');
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));

  // Fail-safe: content should never stay permanently invisible just because
  // the intersection trigger didn't fire (unusual layouts, slow-loading images
  // changing element position, etc.) — force it visible after a short delay.
  setTimeout(() => {
    targets.forEach((t) => t.classList.add('is-visible'));
  }, 1200);
}

/* ---------- Dynamic: services ---------- */
async function renderServices(selector, options = {}) {
  const container = document.querySelector(selector);
  if (!container) return;
  let services = FALLBACK_SERVICES;
  try {
    const fetched = await api.getServices();
    if (fetched && fetched.length) services = fetched;
  } catch (e) {
    console.warn('Using fallback services - backend not reachable:', e.message);
  }
  if (options.limit) services = services.slice(0, options.limit);

  container.innerHTML = services
    .map(
      (s) => `
      <div class="service-card wipe-reveal">
        <div class="icon-badge">${icon(s.icon)}</div>
        <h3>${s.name}</h3>
        <p>${s.shortDescription}</p>
        <a href="contact.html?service=${encodeURIComponent(s.name)}#quote">Request this service ${icon('arrow-right')}</a>
      </div>`
    )
    .join('');
  initWipeReveal();
}

/* ---------- Dynamic: service <select> dropdowns (quote/booking forms) ---------- */
async function populateServiceSelects() {
  const selects = document.querySelectorAll('select[data-service-select]');
  if (!selects.length) return;

  let services = FALLBACK_SERVICES;
  try {
    const fetched = await api.getServices();
    if (fetched && fetched.length) services = fetched;
  } catch (e) {
    console.warn('Using fallback services - backend not reachable:', e.message);
  }

  const params = new URLSearchParams(location.search);
  const preselect = params.get('service');

  selects.forEach((select) => {
    const placeholder = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (placeholder) select.appendChild(placeholder);
    services.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
    if (preselect) select.value = preselect;
  });
}

/* ---------- Dynamic: testimonials ---------- */
async function renderTestimonials(selector) {
  const container = document.querySelector(selector);
  if (!container) return;
  try {
    const testimonials = await api.getTestimonials();
    if (testimonials && testimonials.length) {
      container.innerHTML = testimonials
        .map(
          (t) => `
        <div class="testimonial-card wipe-reveal">
          <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
          <p class="quote">"${t.quote}"</p>
          <div class="author">${t.clientName}</div>
          ${t.clientRole ? `<div class="role">${t.clientRole}</div>` : ''}
        </div>`
        )
        .join('');
    } else {
      container.innerHTML = `<div class="testimonial-placeholder">Client reviews will appear here once approved in the admin dashboard.</div>`;
    }
  } catch (e) {
    container.innerHTML = `<div class="testimonial-placeholder">Client reviews will appear here once approved in the admin dashboard.</div>`;
  }
  initWipeReveal();
}

/* ---------- Dynamic: gallery ---------- */
async function renderGallery(selector) {
  const container = document.querySelector(selector);
  if (!container) return;
  try {
    const images = await api.getGallery();
    if (images && images.length) {
      container.innerHTML = images
        .map(
          (img) => `
        <div class="gallery-item wipe-reveal">
          <img src="${img.imageUrl}" alt="${img.caption || 'ABI Harosfaid cleaning work'}" loading="lazy">
        </div>`
        )
        .join('');
    } else {
      container.innerHTML = Array.from({ length: 6 })
        .map(
          () => `
        <div class="gallery-item wipe-reveal">
          <div class="placeholder-label">Photo coming soon —<br>add via the admin dashboard</div>
        </div>`
        )
        .join('');
    }
  } catch (e) {
    container.innerHTML = Array.from({ length: 6 })
      .map(
        () => `
      <div class="gallery-item wipe-reveal">
        <div class="placeholder-label">Photo coming soon —<br>add via the admin dashboard</div>
      </div>`
      )
      .join('');
  }
  initWipeReveal();
}

/* ---------- Dynamic: gallery slideshow (dedicated gallery page) ---------- */
async function renderGalleryCarousel(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  let images = [];
  try {
    const fetched = await api.getGallery();
    if (fetched && fetched.length) images = fetched;
  } catch (e) {
    // fall through to placeholder handling below
  }

  if (!images.length) {
    container.innerHTML = `
      <div class="carousel-viewport">
        <div class="placeholder-label" style="padding:24px">Photos coming soon —<br>add some via the admin dashboard</div>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="carousel-viewport" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Gallery photos">
      <div class="carousel-track">
        ${images
          .map(
            (img) => `
          <div class="carousel-slide">
            <img src="${img.imageUrl}" alt="${escapeAttr(img.caption) || 'ABI Harosfaid cleaning work'}" loading="lazy">
            ${img.caption ? `<div class="carousel-caption">${escapeAttr(img.caption)}</div>` : ''}
          </div>`
          )
          .join('')}
      </div>
      ${images.length > 1 ? `
        <button type="button" class="carousel-arrow prev" aria-label="Previous photo" data-icon="chevron-left"></button>
        <button type="button" class="carousel-arrow next" aria-label="Next photo" data-icon="chevron-right"></button>
        <div class="carousel-counter"><span data-current>1</span> / ${images.length}</div>
      ` : ''}
      <div aria-live="polite" class="visually-hidden" data-carousel-announce></div>
    </div>
    ${images.length > 1 ? `<div class="carousel-dots">${images.map((_, i) => `<button type="button" class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Go to photo ${i + 1}" data-index="${i}"></button>`).join('')}</div>` : ''}
  `;

  document.querySelectorAll('[data-icon]').forEach((el) => {
    if (!el.innerHTML) el.innerHTML = icon(el.getAttribute('data-icon'));
  });

  if (images.length <= 1) return;

  const viewport = container.querySelector('.carousel-viewport');
  const track = container.querySelector('.carousel-track');
  const dots = Array.from(container.querySelectorAll('.carousel-dot'));
  const counter = container.querySelector('[data-current]');
  const announcer = container.querySelector('[data-carousel-announce]');
  let index = 0;
  let autoplayTimer = null;

  function goTo(newIndex) {
    index = (newIndex + images.length) % images.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    if (counter) counter.textContent = index + 1;
    if (announcer) announcer.textContent = `Showing photo ${index + 1} of ${images.length}`;
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, 4500);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  container.querySelector('.carousel-arrow.next').addEventListener('click', () => { next(); startAutoplay(); });
  container.querySelector('.carousel-arrow.prev').addEventListener('click', () => { prev(); startAutoplay(); });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); startAutoplay(); });
  });

  // Pause on hover/focus, resume on leave
  viewport.addEventListener('mouseenter', stopAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);
  viewport.addEventListener('focusin', stopAutoplay);
  viewport.addEventListener('focusout', startAutoplay);

  // Keyboard navigation
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
  });

  // Touch swipe support
  let touchStartX = null;
  viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
    touchStartX = null;
    startAutoplay();
  }, { passive: true });

  // Pause when the tab isn't visible, resume when it is
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  startAutoplay();
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}


function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `form-status show ${type}`;
}

function serializeForm(form) {
  const data = {};
  new FormData(form).forEach((value, key) => (data[key] = value));
  return data;
}

/* ---------- Quote form ---------- */
function initQuoteForm() {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    try {
      const data = serializeForm(form);
      await api.submitQuote(data);
      showStatus(status, "Thanks! Your quote request has been received - we'll be in touch shortly.", 'success');
      form.reset();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong. Please try again or contact us on WhatsApp.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request Free Quote';
    }
  });
}

/* ---------- Booking form ---------- */
function initBookingForm() {
  const form = document.querySelector('#booking-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const dateInput = form.querySelector('#booking-date');
  const slotContainer = form.querySelector('.slot-options');
  let selectedSlot = '';

  const today = new Date().toISOString().split('T')[0];
  if (dateInput) dateInput.min = today;

  const allSlots = ['Morning (8am - 12pm)', 'Afternoon (12pm - 4pm)', 'Evening (4pm - 7pm)'];

  function renderSlots(taken = []) {
    slotContainer.innerHTML = allSlots
      .map((slot) => {
        const isTaken = taken.includes(slot);
        return `<button type="button" class="slot-option${isTaken ? ' taken' : ''}" data-slot="${slot}" ${isTaken ? 'disabled' : ''}>${slot}</button>`;
      })
      .join('');
    slotContainer.querySelectorAll('.slot-option:not(.taken)').forEach((btn) => {
      btn.addEventListener('click', () => {
        slotContainer.querySelectorAll('.slot-option').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSlot = btn.dataset.slot;
      });
    });
  }
  renderSlots();

  if (dateInput) {
    dateInput.addEventListener('change', async () => {
      if (!dateInput.value) return;
      try {
        const { takenSlots } = await api.checkAvailability(dateInput.value);
        renderSlots(takenSlots || []);
      } catch (e) {
        renderSlots();
      }
      selectedSlot = '';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      showStatus(status, 'Please choose a time slot for your booking.', 'error');
      return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';
    try {
      const data = serializeForm(form);
      data.timeSlot = selectedSlot;
      await api.submitBooking(data);
      showStatus(status, "Your booking request was received! We'll confirm by phone or WhatsApp shortly.", 'success');
      form.reset();
      renderSlots();
      selectedSlot = '';
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong. Please try again or contact us on WhatsApp.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book This Slot';
    }
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    try {
      const data = serializeForm(form);
      await api.submitContact(data);
      showStatus(status, "Message sent! We'll get back to you as soon as possible.", 'success');
      form.reset();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

/* ---------- Form tabs (contact page: Quote / Booking / Message) ---------- */
function initFormTabs() {
  const tabs = document.querySelectorAll('.form-tab');
  const panels = document.querySelectorAll('.form-panel');
  if (!tabs.length) return;

  function activate(target) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.target === target));
    panels.forEach((p) => p.classList.toggle('active', p.id === target));
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.target));
  });

  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    activate(hash);
  }
}

/* ---------- Footer year ---------- */
function setFooterYear() {
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initWhatsApp();
  initWipeReveal();
  renderServices('[data-services-grid]', { limit: window.SERVICES_LIMIT });
  populateServiceSelects();
  renderTestimonials('[data-testimonials-grid]');
  renderGallery('[data-gallery-grid]');
  renderGalleryCarousel('[data-gallery-carousel]');
  initQuoteForm();
  initBookingForm();
  initContactForm();
  initFormTabs();
  setFooterYear();
});