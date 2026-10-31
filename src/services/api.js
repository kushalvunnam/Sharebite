/**
 * ShareBite Centralized API Client
 * Connects to Node.js + Express backend via VITE_API_BASE_URL
 */

const resolveApiBaseUrl = () => {
  let envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!envUrl) {
    if (import.meta.env.PROD) {
      envUrl = 'https://sharebite-1ydl.onrender.com/api';
    } else {
      envUrl = 'http://localhost:5000/api';
    }
  }
  // Strip trailing slashes
  envUrl = envUrl.replace(/\/+$/, '');
  // Ensure /api suffix exists
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
};

export const API_BASE_URL = resolveApiBaseUrl();

class ApiError extends Error {
  constructor(message, status, data = null, isOffline = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isOffline = isOffline;
  }
}

const getAuthToken = () => {
  try {
    return localStorage.getItem('sharebite_token');
  } catch {
    return null;
  }
};

const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('sharebite_token', token);
    } else {
      localStorage.removeItem('sharebite_token');
    }
  } catch {
    // ignore
  }
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const controller = new AbortController();
    // 18s timeout allows for Render free-tier cold-start wakeups
    const timeoutId = setTimeout(() => controller.abort(), 18000);
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.error ||
        (response.status === 503
          ? 'Backend service is starting up or temporarily unavailable. Please retry in a few moments.'
          : `Request failed with status ${response.status}`);
      throw new ApiError(errorMsg, response.status, data, false);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError')
    ) {
      throw new ApiError(
        'Backend server is unreachable or waking up. Please verify your internet connection or retry shortly.',
        0,
        null,
        true
      );
    }
    throw error;
  }
};

export const api = {
  // Health
  checkHealth: async () => {
    return request('/health', { method: 'GET' });
  },

  // Auth
  auth: {
    register: async (userData) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    },
    login: async (credentials) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    },
    getMe: async () => {
      return request('/auth/me', { method: 'GET' });
    },
    logout: () => {
      setAuthToken(null);
    },
  },

  // Listings
  listings: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.status) query.append('status', params.status);
      if (params.donorId) query.append('donorId', params.donorId);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/listings${queryString}`, { method: 'GET' });
    },
    getById: async (id) => {
      return request(`/listings/${id}`, { method: 'GET' });
    },
    create: async (listingData) => {
      return request('/listings', {
        method: 'POST',
        body: JSON.stringify(listingData),
      });
    },
    update: async (id, updateData) => {
      return request(`/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    },
    delete: async (id) => {
      return request(`/listings/${id}`, { method: 'DELETE' });
    },
  },

  // Requests
  requests: {
    create: async (requestData) => {
      return request('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    },
    getMy: async (status) => {
      const query = status ? `?status=${status}` : '';
      return request(`/requests/my${query}`, { method: 'GET' });
    },
    accept: async (id) => {
      return request(`/requests/${id}/accept`, { method: 'PATCH' });
    },
    reject: async (id, reason) => {
      return request(`/requests/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    cancel: async (id, reason) => {
      return request(`/requests/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    pickup: async (id) => {
      return request(`/requests/${id}/pickup`, { method: 'PATCH' });
    },
    complete: async (id, enteredOtp) => {
      return request(`/requests/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ enteredOtp }),
      });
    },
  },

  // Reports
  reports: {
    create: async (reportData) => {
      return request('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
    },
    getAll: async () => {
      return request('/reports', { method: 'GET' });
    },
    updateStatus: async (id, updateData) => {
      return request(`/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    },
  },

  // Admin Dashboard & Moderation
  admin: {
    getStats: async () => {
      return request('/admin/stats', { method: 'GET' });
    },
    getUsers: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.role) query.append('role', params.role);
      if (params.isVerified !== undefined) query.append('isVerified', params.isVerified);
      if (params.search) query.append('search', params.search);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/admin/users${queryString}`, { method: 'GET' });
    },
    verifyUser: async (id, isVerified = true) => {
      return request(`/admin/users/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified }),
      });
    },
    moderateListing: async (id, status, reason) => {
      return request(`/admin/listings/${id}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
      });
    },
    getAuditLogs: async () => {
      return request('/admin/audit-logs', { method: 'GET' });
    },
  },

  // Users
  users: {
    getMe: async () => {
      return request('/users/me', { method: 'GET' });
    },
    updateMe: async (userData) => {
      return request('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
    },
  },

  // Token helper
  setAuthToken,
  getAuthToken,
};

export default api;
