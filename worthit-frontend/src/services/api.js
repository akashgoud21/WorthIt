/**

* WorthIt API Client
* React frontend -> Spring Boot backend -> MySQL
  */

export const BACKEND_BASE_URL = (
import.meta.env.VITE_API_BASE_URL ||
'https://worthit-backend-2m13.onrender.com'
).replace(/\/+$/, '');

const TOKEN_KEY = 'worthit_token';
const USER_KEY = 'worthit_user';

function apiUrl(path) {
return `${BACKEND_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getToken() {
return localStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
if (token) {
localStorage.setItem(TOKEN_KEY, token);
} else {
localStorage.removeItem(TOKEN_KEY);
}
}

export function getStoredUser() {
const user = localStorage.getItem(USER_KEY);
if (!user) return null;

try {
return JSON.parse(user);
} catch {
localStorage.removeItem(USER_KEY);
return null;
}
}

export function setStoredUser(user) {
if (user) {
localStorage.setItem(USER_KEY, JSON.stringify(user));
} else {
localStorage.removeItem(USER_KEY);
}
}

export function clearAuth() {
localStorage.removeItem(TOKEN_KEY);
localStorage.removeItem(USER_KEY);
}

function getHeaders(isMultipart = false) {
const headers = {};
if (!isMultipart) {
headers['Content-Type'] = 'application/json';
headers['Accept'] = 'application/json';
}

const token = getToken();
if (token) headers['Authorization'] = `Bearer ${token}`;

return headers;
}

async function readError(res, fallback) {
const data = await res.json().catch(() => ({}));
return data.message || data.error || `${fallback} (HTTP ${res.status})`;
}

/**

* 1. Health check
     */
     export async function checkBackendHealth() {
     try {
     const res = await fetch(apiUrl('/api/health'), {
     headers: { Accept: 'application/json' },
     cache: 'no-cache',
     });

  if (!res.ok) {
  throw new Error(await readError(res, 'Health check failed'));
  }

  return { isOnline: true, data: await res.json(), error: null };
  } catch (err) {
  return {
  isOnline: false,
  data: null,
  error: err.message || 'Could not connect to WorthIt backend',
  };
  }
  }

/**

* 2. Authentication
  */
  export async function login(email, password) {
  const res = await fetch(apiUrl('/api/auth/login'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ email, password }),
  });

if (!res.ok) {
throw new Error(await readError(res, 'Login failed. Check your credentials.'));
}

const data = await res.json();

if (data.token) {
setToken(data.token);
setStoredUser({
id: data.id,
name: data.name,
email: data.email,
joinedDate: data.joinedDate,
avatar: (data.name?.[0] || 'U').toUpperCase(),
});
}

return data;
}

export async function register(name, email, password) {
const res = await fetch(apiUrl('/api/auth/register'), {
method: 'POST',
headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
body: JSON.stringify({ name, email, password }),
});

if (!res.ok) {
throw new Error(await readError(res, 'Registration failed. Email might already exist.'));
}

const data = await res.json();

if (data.token) {
setToken(data.token);
setStoredUser({
id: data.id,
name: data.name,
email: data.email,
joinedDate: data.joinedDate,
avatar: (data.name?.[0] || 'U').toUpperCase(),
});
}

return data;
}

export async function getCurrentUser() {
const res = await fetch(apiUrl('/api/auth/me'), {
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch user profile'));
}

return res.json();
}

/**

* 3. Dashboard
  */
  export async function fetchDashboardSummary() {
  const res = await fetch(apiUrl('/api/dashboard/summary'), {
  headers: getHeaders(),
  });

if (!res.ok) {
throw new Error(await readError(res, 'Failed to load dashboard summary'));
}

return res.json();
}

/**

* 4. Products
  */
  export async function fetchProducts(search = '', category = '') {
  const params = new URLSearchParams();

if (search) params.append('search', search);
if (category && category !== 'All') params.append('category', category);

const query = params.toString();
const path = `/api/products${query ? `?${query}` : ''}`;

const res = await fetch(apiUrl(path), {
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch products'));
}

return res.json();
}

export async function fetchProductById(id) {
const res = await fetch(apiUrl(`/api/products/${id}`), {
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, `Failed to fetch product ${id}`));
}

return res.json();
}

export async function createProduct(productData) {
const res = await fetch(apiUrl('/api/products'), {
method: 'POST',
headers: getHeaders(),
body: JSON.stringify({
name: productData.name,
category: productData.category || 'Electronics',
brand: productData.brand,
price: productData.price,
purchaseDate: productData.purchaseDate,
warrantyPeriodMonths: parseInt(productData.warrantyPeriod || 12, 10),
}),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to create product'));
}

return res.json();
}

export async function deleteProduct(id) {
const res = await fetch(apiUrl(`/api/products/${id}`), {
method: 'DELETE',
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to delete product'));
}

if (res.status === 204) return null;
return res.json();
}

/**

* 5. Warranties
  */
  export async function fetchWarranties() {
  const res = await fetch(apiUrl('/api/warranties'), {
  headers: getHeaders(),
  });

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch warranties'));
}

return res.json();
}

export async function fetchExpiringWarranties(thresholdDays = 30) {
const res = await fetch(
apiUrl(`/api/warranties/expiring?thresholdDays=${encodeURIComponent(thresholdDays)}`),
{ headers: getHeaders() }
);

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch expiring warranties'));
}

return res.json();
}

/**

* 6. Repairs and analytics
  */
  export async function fetchRepairs() {
  const res = await fetch(apiUrl('/api/repairs/user'), {
  headers: getHeaders(),
  });

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch repairs'));
}

return res.json();
}

export async function createRepair(repairData) {
const res = await fetch(apiUrl('/api/repairs'), {
method: 'POST',
headers: getHeaders(),
body: JSON.stringify({
productId: Number(repairData.productId),
cost: parseFloat(repairData.cost),
serviceCenter: repairData.serviceCenter,
repairDate: repairData.repairDate,
description: repairData.description || 'General maintenance and servicing',
}),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to log repair'));
}

return res.json();
}

export async function fetchRepairAnalytics(productId) {
const res = await fetch(apiUrl(`/api/repairs/product/${productId}/analytics`), {
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch repair analytics'));
}

return res.json();
}

/**

* 7. Documents and OCR
  */
  export async function uploadDocument(file, productId, type = 'INVOICE') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productId', productId);
  formData.append('type', type);

const res = await fetch(apiUrl('/api/documents/upload'), {
method: 'POST',
headers: getHeaders(true),
body: formData,
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to upload document'));
}

return res.json();
}

export async function fetchDocuments(productId) {
const res = await fetch(apiUrl(`/api/documents/product/${productId}`), {
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch documents'));
}

return res.json();
}

/**

* 8. Notifications
  */
  export async function fetchNotifications() {
  const res = await fetch(apiUrl('/api/notifications'), {
  headers: getHeaders(),
  });

if (!res.ok) {
throw new Error(await readError(res, 'Failed to fetch notifications'));
}

return res.json();
}

export async function markNotificationRead(id) {
const res = await fetch(apiUrl(`/api/notifications/${id}/read`), {
method: 'PATCH',
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to mark notification as read'));
}

if (res.status === 204) return null;
return res.json();
}

export async function markAllNotificationsRead() {
const res = await fetch(apiUrl('/api/notifications/read-all'), {
method: 'PATCH',
headers: getHeaders(),
});

if (!res.ok) {
throw new Error(await readError(res, 'Failed to mark all notifications as read'));
}

if (res.status === 204) return null;
return res.json();
}

/**

* API endpoint catalog
  */
  export const API_ROADMAP = {
  HEALTH: {
  method: 'GET',
  path: '/api/health',
  status: 'ACTIVE',
  description: 'Spring Boot server health',
  },
  AUTH_REGISTER: {
  method: 'POST',
  path: '/api/auth/register',
  status: 'ACTIVE',
  description: 'User registration with BCrypt hashed password',
  },
  AUTH_LOGIN: {
  method: 'POST',
  path: '/api/auth/login',
  status: 'ACTIVE',
  description: 'User login returning JWT token',
  },
  PRODUCTS_LIST: {
  method: 'GET',
  path: '/api/products',
  status: 'ACTIVE',
  description: 'List products',
  },
  PRODUCTS_CREATE: {
  method: 'POST',
  path: '/api/products',
  status: 'ACTIVE',
  description: 'Create product and warranty record',
  },
  DOCUMENTS_UPLOAD: {
  method: 'POST',
  path: '/api/documents/upload',
  status: 'ACTIVE',
  description: 'Upload invoice/warranty document',
  },
  WARRANTIES_EXPIRING: {
  method: 'GET',
  path: '/api/warranties/expiring',
  status: 'ACTIVE',
  description: 'Get expiring warranties',
  },
  REPAIRS_LOG: {
  method: 'POST',
  path: '/api/repairs',
  status: 'ACTIVE',
  description: 'Log repair costs',
  },
  DASHBOARD_SUMMARY: {
  method: 'GET',
  path: '/api/dashboard/summary',
  status: 'ACTIVE',
  description: 'Dashboard summary',
  },
  NOTIFICATIONS: {
  method: 'GET',
  path: '/api/notifications',
  status: 'ACTIVE',
  description: 'Warranty and service notifications',
  },
  };
