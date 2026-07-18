// ==========================================================================
// ABI Harosfaid site configuration
// Edit these values to match your deployment / contact details.
// ==========================================================================

// If your backend is deployed separately from this frontend (e.g. frontend on
// GitHub Pages, backend on Render/Railway), set the full URL to your backend here.
// If the frontend is served BY the same Express server as the backend, '/api' is correct as-is.
const API_BASE_URL = '/api';

const COMPANY = {
  name: 'ABI Harosfaid Limited',
  phone: '0803 516 0287',
  phoneIntl: '2348035160287',
  whatsappPrimary: '2348035160287', // +234 803 516 0287
  whatsappSecondary: '2349160318713', // +234 916 031 8713
  email: 'harosfaidnigerialimited@gmail.com',
  city: 'Lagos, Nigeria',
};

function buildWhatsAppLink(number, message) {
  const text = encodeURIComponent(message || `Hello ${COMPANY.name}, I'd like to enquire about your cleaning services.`);
  return `https://wa.me/${number}?text=${text}`;
}
