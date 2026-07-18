// ==========================================================================
// Admin auth helper
// Uses in-memory + localStorage token storage (fine for an internal admin tool).
// ==========================================================================

const ADMIN_API_BASE = '/api';
const TOKEN_KEY = 'harosfaid_admin_token';
const ADMIN_KEY = 'harosfaid_admin_user';

const auth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getAdmin() {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
    } catch {
      return null;
    }
  },
  setSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify({ name: data.name, email: data.email, role: data.role }));
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  // Redirect to login if not authenticated. Call at the top of every dashboard page.
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },
  logout() {
    this.clearSession();
    window.location.href = 'login.html';
  },
};

// Authenticated API request helper
async function adminApi(path, options = {}) {
  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.getToken()}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    auth.clearSession();
    window.location.href = 'login.html';
    return null;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}
