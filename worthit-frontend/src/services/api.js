/**
 * WorthIt API Client
 * Connects React frontend directly to Spring Boot backend REST endpoints
 * and MySQL database.
 */

export const BACKEND_BASE_URL = 'http://localhost:8080';

const TOKEN_KEY = 'worthit_token';
const USER_KEY = 'worthit_user';

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
  const u = localStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
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
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * 1. Health Check
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache',
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return {
      isOnline: true,
      data,
      error: null,
    };
  } catch (err) {
    return {
      isOnline: false,
      data: null,
      error: err.message || 'Could not connect to Spring Boot server on http://localhost:8080',
    };
  }
}

/**
 * 2. Authentication
 */
export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed. Please check your credentials.');
  }
  const data = await res.json();
  if (data.token) {
    setToken(data.token);
    setStoredUser({
      id: data.id,
      name: data.name,
      email: data.email,
      joinedDate: data.joinedDate,
      avatar: (data.name ? data.name[0] : 'U').toUpperCase(),
    });
  }
  return data;
}

export async function register(name, email, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed. Email might already exist.');
  }
  const data = await res.json();
  if (data.token) {
    setToken(data.token);
    setStoredUser({
      id: data.id,
      name: data.name,
      email: data.email,
      joinedDate: data.joinedDate,
      avatar: (data.name ? data.name[0] : 'U').toUpperCase(),
    });
  }
  return data;
}

export async function getCurrentUser() {
  const res = await fetch('/api/auth/me', {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return await res.json();
}

/**
 * 3. Dashboard Summary
 */
export async function fetchDashboardSummary() {
  const res = await fetch('/api/dashboard/summary', {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to load dashboard summary (${res.status})`);
  }
  return await res.json();
}

/**
 * 4. Products CRUD
 */
export async function fetchProducts(search = '', category = '') {
  let url = '/api/products';
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);
  const q = params.toString();
  if (q) url += `?${q}`;

  const res = await fetch(url, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }
  return await res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`/api/products/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  return await res.json();
}

export async function createProduct(productData) {
  const res = await fetch('/api/products', {
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
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create product');
  }
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to delete product (${res.status})`);
  }
  return await res.json();
}

/**
 * 5. Warranties
 */
export async function fetchWarranties() {
  const res = await fetch('/api/warranties', {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch warranties (${res.status})`);
  }
  return await res.json();
}

export async function fetchExpiringWarranties(thresholdDays = 30) {
  const res = await fetch(`/api/warranties/expiring?thresholdDays=${thresholdDays}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch expiring warranties (${res.status})`);
  }
  return await res.json();
}

/**
 * 6. Repairs & WorthIt Analytics
 */
export async function fetchRepairs() {
  const res = await fetch('/api/repairs/user', {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch repairs (${res.status})`);
  }
  return await res.json();
}

export async function createRepair(repairData) {
  const res = await fetch('/api/repairs', {
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
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to log repair');
  }
  return await res.json();
}

export async function fetchRepairAnalytics(productId) {
  const res = await fetch(`/api/repairs/product/${productId}/analytics`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch repair analytics for product ${productId}`);
  }
  return await res.json();
}

/**
 * 7. Document Upload & OCR
 */
export async function uploadDocument(file, productId, type = 'INVOICE') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productId', productId);
  formData.append('type', type);

  const res = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload document');
  }
  return await res.json();
}

export async function fetchDocuments(productId) {
  const res = await fetch(`/api/documents/product/${productId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch documents for product ${productId}`);
  }
  return await res.json();
}

/**
 * 8. Notifications
 */
export async function fetchNotifications() {
  const res = await fetch('/api/notifications', {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications (${res.status})`);
  }
  return await res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to mark notification ${id} as read`);
  }
  return await res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch('/api/notifications/read-all', {
    method: 'PATCH',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
  return await res.json();
}

// Complete API Status Catalog
export const API_ROADMAP = {
  HEALTH: { method: 'GET', path: '/api/health', status: 'ACTIVE', description: 'Spring Boot server health & MySQL connection status' },
  AUTH_REGISTER: { method: 'POST', path: '/api/auth/register', status: 'ACTIVE', description: 'User registration with BCrypt hashed password' },
  AUTH_LOGIN: { method: 'POST', path: '/api/auth/login', status: 'ACTIVE', description: 'User login returning JWT token' },
  PRODUCTS_LIST: { method: 'GET', path: '/api/products', status: 'ACTIVE', description: 'List user products scoped by JWT' },
  PRODUCTS_CREATE: { method: 'POST', path: '/api/products', status: 'ACTIVE', description: 'Register product and auto-create warranty record' },
  DOCUMENTS_UPLOAD: { method: 'POST', path: '/api/documents/upload', status: 'ACTIVE', description: 'Multipart upload invoice/warranty document + OCR extraction' },
  WARRANTIES_EXPIRING: { method: 'GET', path: '/api/warranties/expiring', status: 'ACTIVE', description: 'Get warranties expiring within threshold days' },
  REPAIRS_LOG: { method: 'POST', path: '/api/repairs', status: 'ACTIVE', description: 'Log repair cost, service center, and calculate repair-versus-replace' },
  DASHBOARD_SUMMARY: { method: 'GET', path: '/api/dashboard/summary', status: 'ACTIVE', description: 'Aggregated metrics for products, active warranties, repairs' },
  NOTIFICATIONS: { method: 'GET', path: '/api/notifications', status: 'ACTIVE', description: 'Scheduled warranty expiry and service notifications' },
};
