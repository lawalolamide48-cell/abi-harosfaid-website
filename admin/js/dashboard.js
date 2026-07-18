// ==========================================================================
// ABI Harosfaid Admin — dashboard.js
// ==========================================================================

auth.requireAuth();

/* ---------- Icons ---------- */
const ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3 6.5 7 .9-5.2 4.9 1.4 7-6.2-3.5-6.2 3.5 1.4-7L2.2 9.4l7-.9z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
  'external-link': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>',
  'log-out': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
};
function icon(name) { return ICONS[name] || ''; }
document.querySelectorAll('[data-icon]').forEach((el) => (el.innerHTML = icon(el.getAttribute('data-icon'))));

/* ---------- Toast ---------- */
function toast(message, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast show${isError ? ' error' : ''}`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ---------- Modal ---------- */
const overlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
function openModal(html) {
  modalContent.innerHTML = html;
  overlay.classList.add('open');
}
function closeModal() {
  overlay.classList.remove('open');
  modalContent.innerHTML = '';
}
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

/* ---------- Navigation between views ---------- */
const views = ['overview', 'quotes', 'bookings', 'messages', 'testimonials', 'gallery', 'services'];
function showView(name) {
  views.forEach((v) => {
    document.getElementById(`view-${v}`).style.display = v === name ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-nav a').forEach((a) => a.classList.toggle('active', a.dataset.view === name));
  const loaders = { overview: loadOverview, quotes: loadQuotes, bookings: loadBookings, messages: loadMessages, testimonials: loadTestimonials, gallery: loadGallery, services: loadServices };
  loaders[name] && loaders[name]();
}
document.querySelectorAll('.sidebar-nav a').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    showView(a.dataset.view);
    history.replaceState(null, '', `#${a.dataset.view}`);
  });
});
document.getElementById('logout-btn').addEventListener('click', () => auth.logout());
document.getElementById('view-site-btn').addEventListener('click', () => window.open('../frontend/index.html', '_blank'));

const admin = auth.getAdmin();
if (admin) document.getElementById('welcome-msg').textContent = `Welcome back, ${admin.name.split(' ')[0]}`;

/* ---------- Helpers ---------- */
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function badgeClass(status) {
  return `badge badge-${status.toLowerCase().replace(/\s+/g, '-')}`;
}
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ==========================================================================
   OVERVIEW
   ========================================================================== */
async function loadOverview() {
  try {
    const stats = await adminApi('/dashboard/stats');
    if (!stats) return;
    const cards = document.querySelectorAll('#stats-grid .stat-value');
    cards[0].textContent = stats.newQuotes;
    cards[1].textContent = stats.totalQuotes;
    cards[2].textContent = stats.upcomingBookings;
    cards[3].textContent = stats.totalBookings;
    cards[4].textContent = stats.unreadMessages;

    document.getElementById('recent-quotes-body').innerHTML = stats.recentQuotes.length
      ? stats.recentQuotes.map((q) => `
        <tr><td>${escapeHtml(q.name)}</td><td>${escapeHtml(q.serviceType)}</td><td>${escapeHtml(q.phone)}</td>
        <td><span class="${badgeClass(q.status)}">${q.status}</span></td><td>${fmtDate(q.createdAt)}</td></tr>`).join('')
      : `<tr><td colspan="5"><div class="empty-state">No quote requests yet.</div></td></tr>`;

    document.getElementById('recent-bookings-body').innerHTML = stats.recentBookings.length
      ? stats.recentBookings.map((b) => `
        <tr><td>${escapeHtml(b.name)}</td><td>${escapeHtml(b.serviceType)}</td><td>${fmtDate(b.scheduledDate)}</td>
        <td>${escapeHtml(b.timeSlot)}</td><td><span class="${badgeClass(b.status)}">${b.status}</span></td></tr>`).join('')
      : `<tr><td colspan="5"><div class="empty-state">No bookings yet.</div></td></tr>`;
  } catch (e) {
    toast(e.message, true);
  }
}

/* ==========================================================================
   QUOTES
   ========================================================================== */
async function loadQuotes() {
  const status = document.getElementById('quote-status-filter').value;
  const body = document.getElementById('quotes-body');
  try {
    const quotes = await adminApi(`/quotes${status ? `?status=${status}` : ''}`);
    if (!quotes) return;
    body.innerHTML = quotes.length ? quotes.map((q) => `
      <tr data-id="${q._id}">
        <td>${escapeHtml(q.name)}</td>
        <td>${escapeHtml(q.phone)}${q.email ? `<br><span style="color:var(--charcoal-soft)">${escapeHtml(q.email)}</span>` : ''}</td>
        <td>${escapeHtml(q.serviceType)}</td>
        <td>${escapeHtml(q.propertyType || '—')}</td>
        <td>${escapeHtml(q.address)}</td>
        <td>${q.preferredDate ? fmtDate(q.preferredDate) : '—'}</td>
        <td>
          <select class="status-select" data-action="quote-status">
            ${['New','Contacted','Quoted','Converted','Closed'].map((s) => `<option value="${s}" ${s===q.status?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>${fmtDate(q.createdAt)}</td>
        <td class="row-actions">
          <button class="icon-btn" data-action="quote-view" title="View / Notes">${icon('eye')}</button>
          <button class="icon-btn danger" data-action="quote-delete" title="Delete">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="9"><div class="empty-state">No quote requests found.</div></td></tr>`;
  } catch (e) { toast(e.message, true); }
}
document.getElementById('quote-status-filter').addEventListener('change', loadQuotes);

document.getElementById('quotes-body').addEventListener('change', async (e) => {
  if (e.target.dataset.action === 'quote-status') {
    const id = e.target.closest('tr').dataset.id;
    try {
      await adminApi(`/quotes/${id}`, { method: 'PATCH', body: JSON.stringify({ status: e.target.value }) });
      toast('Status updated');
    } catch (err) { toast(err.message, true); }
  }
});

document.getElementById('quotes-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;

  if (btn.dataset.action === 'quote-delete') {
    if (!confirm('Delete this quote request? This cannot be undone.')) return;
    try {
      await adminApi(`/quotes/${id}`, { method: 'DELETE' });
      toast('Quote request deleted');
      loadQuotes();
    } catch (err) { toast(err.message, true); }
  }

  if (btn.dataset.action === 'quote-view') {
    try {
      const quotes = await adminApi('/quotes');
      const q = quotes.find((x) => x._id === id);
      if (!q) return;
      openModal(`
        <h3>Quote Request — ${escapeHtml(q.name)}</h3>
        <p style="margin-bottom:14px;color:var(--charcoal-soft);font-size:0.88rem">
          ${escapeHtml(q.phone)} ${q.email ? '· ' + escapeHtml(q.email) : ''}<br>
          ${escapeHtml(q.serviceType)} · ${escapeHtml(q.propertyType || '')}<br>
          ${escapeHtml(q.address)}
        </p>
        <p style="margin-bottom:16px;font-size:0.9rem"><strong>Message:</strong><br>${escapeHtml(q.message) || 'None'}</p>
        <div class="field">
          <label for="quote-notes">Internal Notes</label>
          <textarea id="quote-notes">${escapeHtml(q.adminNotes)}</textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="modal-cancel">Close</button>
          <button class="btn btn-primary" id="quote-notes-save">Save Notes</button>
        </div>
      `);
      document.getElementById('modal-cancel').addEventListener('click', closeModal);
      document.getElementById('quote-notes-save').addEventListener('click', async () => {
        try {
          await adminApi(`/quotes/${id}`, { method: 'PATCH', body: JSON.stringify({ adminNotes: document.getElementById('quote-notes').value }) });
          toast('Notes saved');
          closeModal();
        } catch (err) { toast(err.message, true); }
      });
    } catch (err) { toast(err.message, true); }
  }
});

/* ==========================================================================
   BOOKINGS
   ========================================================================== */
async function loadBookings() {
  const status = document.getElementById('booking-status-filter').value;
  const date = document.getElementById('booking-date-filter').value;
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (date) params.set('date', date);
  const body = document.getElementById('bookings-body');
  try {
    const bookings = await adminApi(`/bookings${params.toString() ? `?${params}` : ''}`);
    if (!bookings) return;
    body.innerHTML = bookings.length ? bookings.map((b) => `
      <tr data-id="${b._id}">
        <td>${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.phone)}${b.email ? `<br><span style="color:var(--charcoal-soft)">${escapeHtml(b.email)}</span>` : ''}</td>
        <td>${escapeHtml(b.serviceType)}</td>
        <td>${escapeHtml(b.address)}</td>
        <td>${fmtDate(b.scheduledDate)}</td>
        <td>${escapeHtml(b.timeSlot)}</td>
        <td>
          <input type="text" class="status-select" data-action="booking-staff" value="${escapeHtml(b.assignedStaff)}" placeholder="Unassigned" style="width:110px">
        </td>
        <td>
          <select class="status-select" data-action="booking-status">
            ${['Pending','Confirmed','In Progress','Completed','Cancelled'].map((s) => `<option value="${s}" ${s===b.status?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td class="row-actions">
          <button class="icon-btn" data-action="booking-view" title="View Notes">${icon('eye')}</button>
          <button class="icon-btn danger" data-action="booking-delete" title="Delete">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="9"><div class="empty-state">No bookings found.</div></td></tr>`;
  } catch (e) { toast(e.message, true); }
}
document.getElementById('booking-status-filter').addEventListener('change', loadBookings);
document.getElementById('booking-date-filter').addEventListener('change', loadBookings);

document.getElementById('bookings-body').addEventListener('change', async (e) => {
  const id = e.target.closest('tr')?.dataset.id;
  if (!id) return;
  if (e.target.dataset.action === 'booking-status') {
    try {
      await adminApi(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: e.target.value }) });
      toast('Status updated');
    } catch (err) { toast(err.message, true); }
  }
  if (e.target.dataset.action === 'booking-staff') {
    try {
      await adminApi(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ assignedStaff: e.target.value }) });
      toast('Staff assignment updated');
    } catch (err) { toast(err.message, true); }
  }
});

document.getElementById('bookings-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;

  if (btn.dataset.action === 'booking-delete') {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    try {
      await adminApi(`/bookings/${id}`, { method: 'DELETE' });
      toast('Booking deleted');
      loadBookings();
    } catch (err) { toast(err.message, true); }
  }

  if (btn.dataset.action === 'booking-view') {
    try {
      const bookings = await adminApi('/bookings');
      const b = bookings.find((x) => x._id === id);
      if (!b) return;
      openModal(`
        <h3>Booking — ${escapeHtml(b.name)}</h3>
        <p style="margin-bottom:14px;color:var(--charcoal-soft);font-size:0.88rem">
          ${escapeHtml(b.phone)} ${b.email ? '· ' + escapeHtml(b.email) : ''}<br>
          ${escapeHtml(b.serviceType)} · ${fmtDate(b.scheduledDate)} · ${escapeHtml(b.timeSlot)}<br>
          ${escapeHtml(b.address)}
        </p>
        <p style="margin-bottom:16px;font-size:0.9rem"><strong>Customer Notes:</strong><br>${escapeHtml(b.notes) || 'None'}</p>
        <div class="field">
          <label for="booking-notes">Internal Notes</label>
          <textarea id="booking-notes">${escapeHtml(b.adminNotes)}</textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="modal-cancel">Close</button>
          <button class="btn btn-primary" id="booking-notes-save">Save Notes</button>
        </div>
      `);
      document.getElementById('modal-cancel').addEventListener('click', closeModal);
      document.getElementById('booking-notes-save').addEventListener('click', async () => {
        try {
          await adminApi(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ adminNotes: document.getElementById('booking-notes').value }) });
          toast('Notes saved');
          closeModal();
        } catch (err) { toast(err.message, true); }
      });
    } catch (err) { toast(err.message, true); }
  }
});

/* ==========================================================================
   MESSAGES
   ========================================================================== */
async function loadMessages() {
  const body = document.getElementById('messages-body');
  try {
    const messages = await adminApi('/contact');
    if (!messages) return;
    body.innerHTML = messages.length ? messages.map((m) => `
      <tr data-id="${m._id}" style="${m.isRead ? '' : 'font-weight:600'}">
        <td>${escapeHtml(m.name)}</td>
        <td>${m.email ? escapeHtml(m.email) : ''}${m.phone ? `<br>${escapeHtml(m.phone)}` : ''}</td>
        <td>${escapeHtml(m.subject)}</td>
        <td style="max-width:280px;white-space:normal">${escapeHtml(m.message).slice(0, 100)}${m.message.length > 100 ? '…' : ''}</td>
        <td>${fmtDate(m.createdAt)}</td>
        <td class="row-actions">
          <button class="icon-btn" data-action="msg-view" title="View">${icon('eye')}</button>
          <button class="icon-btn danger" data-action="msg-delete" title="Delete">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="6"><div class="empty-state">No messages yet.</div></td></tr>`;
  } catch (e) { toast(e.message, true); }
}

document.getElementById('messages-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;

  if (btn.dataset.action === 'msg-delete') {
    if (!confirm('Delete this message?')) return;
    try {
      await adminApi(`/contact/${id}`, { method: 'DELETE' });
      toast('Message deleted');
      loadMessages();
    } catch (err) { toast(err.message, true); }
  }

  if (btn.dataset.action === 'msg-view') {
    try {
      const messages = await adminApi('/contact');
      const m = messages.find((x) => x._id === id);
      if (!m) return;
      if (!m.isRead) await adminApi(`/contact/${id}`, { method: 'PATCH', body: JSON.stringify({ isRead: true }) });
      openModal(`
        <h3>Message from ${escapeHtml(m.name)}</h3>
        <p style="margin-bottom:14px;color:var(--charcoal-soft);font-size:0.88rem">
          ${m.email ? escapeHtml(m.email) : ''} ${m.phone ? '· ' + escapeHtml(m.phone) : ''}<br>
          Subject: ${escapeHtml(m.subject)}
        </p>
        <p style="font-size:0.92rem;white-space:pre-wrap">${escapeHtml(m.message)}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" id="modal-cancel">Close</button>
        </div>
      `);
      document.getElementById('modal-cancel').addEventListener('click', () => { closeModal(); loadMessages(); });
    } catch (err) { toast(err.message, true); }
  }
});

/* ==========================================================================
   TESTIMONIALS
   ========================================================================== */
async function loadTestimonials() {
  const body = document.getElementById('testimonials-body');
  try {
    const testimonials = await adminApi('/testimonials/all');
    if (!testimonials) return;
    body.innerHTML = testimonials.length ? testimonials.map((t) => `
      <tr data-id="${t._id}">
        <td>${escapeHtml(t.clientName)}</td>
        <td>${escapeHtml(t.clientRole || '—')}</td>
        <td style="max-width:280px;white-space:normal">${escapeHtml(t.quote).slice(0,90)}${t.quote.length>90?'…':''}</td>
        <td>${'★'.repeat(t.rating)}</td>
        <td>
          <input type="checkbox" data-action="testimonial-approve" ${t.isApproved ? 'checked' : ''}>
        </td>
        <td class="row-actions">
          <button class="icon-btn" data-action="testimonial-edit" title="Edit">${icon('edit')}</button>
          <button class="icon-btn danger" data-action="testimonial-delete" title="Delete">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="6"><div class="empty-state">No testimonials yet. Add one to feature it on the homepage.</div></td></tr>`;
  } catch (e) { toast(e.message, true); }
}

function testimonialForm(t = {}) {
  const rating = t.rating || 5;
  return `
    <h3>${t._id ? 'Edit' : 'Add'} Testimonial</h3>
    <div class="field"><label for="t-name">Client Name</label><input type="text" id="t-name" value="${escapeHtml(t.clientName || '')}"></div>
    <div class="field"><label for="t-role">Role / Location (optional)</label><input type="text" id="t-role" value="${escapeHtml(t.clientRole || '')}" placeholder="e.g. Office Manager, Lekki"></div>
    <div class="field"><label for="t-quote">Quote</label><textarea id="t-quote">${escapeHtml(t.quote || '')}</textarea></div>
    <div class="field">
      <label>Rating</label>
      <div class="stars-input" id="t-stars">
        ${[1,2,3,4,5].map((n) => `<button type="button" data-star="${n}" class="${n<=rating?'active':''}">★</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <label><input type="checkbox" id="t-approved" ${t.isApproved ? 'checked' : ''} style="width:auto;margin-right:8px"> Approved (visible on site)</label>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="t-save">Save</button>
    </div>
  `;
}

function wireTestimonialModal(t = {}) {
  let rating = t.rating || 5;
  const starButtons = document.querySelectorAll('#t-stars button');
  starButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      rating = Number(btn.dataset.star);
      starButtons.forEach((b) => b.classList.toggle('active', Number(b.dataset.star) <= rating));
    });
  });
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('t-save').addEventListener('click', async () => {
    const payload = {
      clientName: document.getElementById('t-name').value,
      clientRole: document.getElementById('t-role').value,
      quote: document.getElementById('t-quote').value,
      rating,
      isApproved: document.getElementById('t-approved').checked,
    };
    if (!payload.clientName || !payload.quote) { toast('Name and quote are required', true); return; }
    try {
      if (t._id) {
        await adminApi(`/testimonials/${t._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Testimonial updated');
      } else {
        await adminApi('/testimonials', { method: 'POST', body: JSON.stringify(payload) });
        toast('Testimonial added');
      }
      closeModal();
      loadTestimonials();
    } catch (err) { toast(err.message, true); }
  });
}

document.getElementById('add-testimonial-btn').addEventListener('click', () => {
  openModal(testimonialForm());
  wireTestimonialModal();
});

document.getElementById('testimonials-body').addEventListener('change', async (e) => {
  if (e.target.dataset.action === 'testimonial-approve') {
    const id = e.target.closest('tr').dataset.id;
    try {
      await adminApi(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify({ isApproved: e.target.checked }) });
      toast(e.target.checked ? 'Testimonial approved — now visible on site' : 'Testimonial hidden from site');
    } catch (err) { toast(err.message, true); }
  }
});

document.getElementById('testimonials-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;

  if (btn.dataset.action === 'testimonial-delete') {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await adminApi(`/testimonials/${id}`, { method: 'DELETE' });
      toast('Testimonial deleted');
      loadTestimonials();
    } catch (err) { toast(err.message, true); }
  }

  if (btn.dataset.action === 'testimonial-edit') {
    try {
      const all = await adminApi('/testimonials/all');
      const t = all.find((x) => x._id === id);
      if (!t) return;
      openModal(testimonialForm(t));
      wireTestimonialModal(t);
    } catch (err) { toast(err.message, true); }
  }
});

/* ==========================================================================
   GALLERY
   ========================================================================== */
async function loadGallery() {
  const body = document.getElementById('gallery-body');
  try {
    const images = await adminApi('/gallery');
    if (!images) return;
    body.innerHTML = images.length ? images.map((img) => `
      <tr data-id="${img._id}">
        <td><img src="${escapeHtml(img.imageUrl)}" alt="" style="width:70px;height:52px;object-fit:cover;border-radius:6px" onerror="this.style.display='none'"></td>
        <td>${escapeHtml(img.caption || '—')}</td>
        <td>${escapeHtml(img.category || 'General')}</td>
        <td class="row-actions">
          <button class="icon-btn" data-action="gallery-edit" title="Edit">${icon('edit')}</button>
          <button class="icon-btn danger" data-action="gallery-delete" title="Delete">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="4"><div class="empty-state">No images yet. Add one to populate the public gallery.</div></td></tr>`;
  } catch (e) { toast(e.message, true); }
}

function galleryForm(img = {}) {
  return `
    <h3>${img._id ? 'Edit' : 'Add'} Gallery Image</h3>
    <p style="font-size:0.85rem;color:var(--charcoal-soft);margin-bottom:16px">Paste a direct image URL (e.g. from Cloudinary, Imgur, or your own hosting).</p>
    <div class="field"><label for="g-url">Image URL</label><input type="url" id="g-url" placeholder="https://..." value="${escapeHtml(img.imageUrl || '')}"></div>
    <div class="field"><label for="g-caption">Caption (optional)</label><input type="text" id="g-caption" value="${escapeHtml(img.caption || '')}" placeholder="e.g. Deep cleaning — 3-bedroom apartment, Lekki"></div>
    <div class="field"><label for="g-category">Category (optional)</label><input type="text" id="g-category" value="${escapeHtml(img.category || '')}" placeholder="e.g. Office, Residential"></div>
    <div class="modal-actions">
      <button class="btn btn-outline" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="g-save">${img._id ? 'Save Changes' : 'Add Image'}</button>
    </div>
  `;
}

function wireGalleryModal(img = {}) {
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('g-save').addEventListener('click', async () => {
    const imageUrl = document.getElementById('g-url').value.trim();
    if (!imageUrl) { toast('Image URL is required', true); return; }
    const payload = {
      imageUrl,
      caption: document.getElementById('g-caption').value,
      category: document.getElementById('g-category').value || 'General',
    };
    try {
      if (img._id) {
        await adminApi(`/gallery/${img._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Image updated');
      } else {
        await adminApi('/gallery', { method: 'POST', body: JSON.stringify(payload) });
        toast('Image added');
      }
      closeModal();
      loadGallery();
    } catch (err) { toast(err.message, true); }
  });
}

document.getElementById('add-gallery-btn').addEventListener('click', () => {
  openModal(galleryForm());
  wireGalleryModal();
});

document.getElementById('gallery-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;

  if (btn.dataset.action === 'gallery-delete') {
    if (!confirm('Delete this image?')) return;
    try {
      await adminApi(`/gallery/${id}`, { method: 'DELETE' });
      toast('Image deleted');
      loadGallery();
    } catch (err) { toast(err.message, true); }
  }

  if (btn.dataset.action === 'gallery-edit') {
    try {
      const images = await adminApi('/gallery');
      const img = images.find((x) => x._id === id);
      if (!img) return;
      openModal(galleryForm(img));
      wireGalleryModal(img);
    } catch (err) { toast(err.message, true); }
  }
});

/* ==========================================================================
   SERVICES
   ========================================================================== */
async function loadServices() {
  const body = document.getElementById('services-body');
  try {
    const services = await adminApi('/services/all');
    if (!services) return;
    body.innerHTML = services.length ? services.map((s) => `
      <tr data-id="${s._id}">
        <td>${escapeHtml(s.name)}</td>
        <td style="max-width:320px;white-space:normal">${escapeHtml(s.shortDescription)}</td>
        <td><input type="checkbox" data-action="service-toggle" ${s.isActive ? 'checked' : ''}></td>
        <td class="row-actions">
          <button class="icon-btn" data-action="service-edit" title="Edit">${icon('edit')}</button>
          <button class="icon-btn danger" data-action="service-delete" title="Delete">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="4"><div class="empty-state">No services yet.</div></td></tr>`;
  } catch (e) { toast(e.message, true); }
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function serviceForm(s = {}) {
  return `
    <h3>${s._id ? 'Edit' : 'Add'} Service</h3>
    <div class="field"><label for="s-name">Service Name</label><input type="text" id="s-name" value="${escapeHtml(s.name || '')}"></div>
    <div class="field"><label for="s-short">Short Description</label><textarea id="s-short">${escapeHtml(s.shortDescription || '')}</textarea></div>
    <div class="field"><label for="s-full">Full Description (optional)</label><textarea id="s-full">${escapeHtml(s.fullDescription || '')}</textarea></div>
    <div class="field">
      <label><input type="checkbox" id="s-active" ${s.isActive !== false ? 'checked' : ''} style="width:auto;margin-right:8px"> Active (visible on site)</label>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="s-save">Save</button>
    </div>
  `;
}

function wireServiceModal(s = {}) {
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('s-save').addEventListener('click', async () => {
    const name = document.getElementById('s-name').value.trim();
    const shortDescription = document.getElementById('s-short').value.trim();
    if (!name || !shortDescription) { toast('Name and short description are required', true); return; }
    const payload = {
      name,
      shortDescription,
      fullDescription: document.getElementById('s-full').value,
      isActive: document.getElementById('s-active').checked,
    };
    try {
      if (s._id) {
        await adminApi(`/services/${s._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Service updated');
      } else {
        payload.slug = slugify(name);
        await adminApi('/services', { method: 'POST', body: JSON.stringify(payload) });
        toast('Service added');
      }
      closeModal();
      loadServices();
    } catch (err) { toast(err.message, true); }
  });
}

document.getElementById('add-service-btn').addEventListener('click', () => {
  openModal(serviceForm());
  wireServiceModal();
});

document.getElementById('services-body').addEventListener('change', async (e) => {
  if (e.target.dataset.action === 'service-toggle') {
    const id = e.target.closest('tr').dataset.id;
    try {
      await adminApi(`/services/${id}`, { method: 'PUT', body: JSON.stringify({ isActive: e.target.checked }) });
      toast(e.target.checked ? 'Service is now visible on site' : 'Service hidden from site');
    } catch (err) { toast(err.message, true); }
  }
});

document.getElementById('services-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.closest('tr').dataset.id;

  if (btn.dataset.action === 'service-delete') {
    if (!confirm('Delete this service? It will be removed from the site.')) return;
    try {
      await adminApi(`/services/${id}`, { method: 'DELETE' });
      toast('Service deleted');
      loadServices();
    } catch (err) { toast(err.message, true); }
  }

  if (btn.dataset.action === 'service-edit') {
    try {
      const services = await adminApi('/services/all');
      const s = services.find((x) => x._id === id);
      if (!s) return;
      openModal(serviceForm(s));
      wireServiceModal(s);
    } catch (err) { toast(err.message, true); }
  }
});

/* ---------- Init ---------- */
const initialView = location.hash.replace('#', '') || 'overview';
showView(views.includes(initialView) ? initialView : 'overview');