const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const defaultHeaders = { 'Content-Type': 'application/json' };

const handle = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(()=> '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  // Try JSON else text
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
};

export const api = {
  get: (path, opts = {}) => handle(fetch(`${baseURL}${path}`, { ...opts, method: 'GET', headers: { ...defaultHeaders, ...(opts.headers||{}) } })),
  post: (path, body, opts = {}) => handle(fetch(`${baseURL}${path}`, { ...opts, method: 'POST', body: JSON.stringify(body), headers: { ...defaultHeaders, ...(opts.headers||{}) } })),
  put: (path, body, opts = {}) => handle(fetch(`${baseURL}${path}`, { ...opts, method: 'PUT', body: JSON.stringify(body), headers: { ...defaultHeaders, ...(opts.headers||{}) } })),
  del: (path, opts = {}) => handle(fetch(`${baseURL}${path}`, { ...opts, method: 'DELETE', headers: { ...defaultHeaders, ...(opts.headers||{}) } })),
};

export default api;