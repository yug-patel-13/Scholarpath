import axios from 'axios';

const API_BASE_URL = 'http://localhost:7000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, phone) => api.post('/auth/register', { name, email, password, phone }),
};

export const userAPI = {
  getProfile: (userId) => api.get(`/user-profiles/user/${userId}`),
  createProfile: (data) => api.post('/user-profiles', data),
  updateProfile: (id, data) => api.patch(`/user-profiles/${id}`, data),
};

// Alias for compatibility
export const userProfileAPI = userAPI;

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export const scholarshipAPI = {
  getAll: () => api.get('/scholarships'),
  getById: (id) => api.get(`/scholarships/${id}`),
  getByCategory: (categoryId) => api.get(`/scholarships/category/${categoryId}`),
  getEligible: (userId) => api.post('/scholarships/eligible', { userId }),
};

export const formFillRequestAPI = {
  create: (data) => api.post('/form-fill-requests', data),
  getAll: () => api.get('/form-fill-requests'),
  getByUser: (userId) => api.get(`/form-fill-requests/user/${userId}`),
  getById: (id) => api.get(`/form-fill-requests/${id}`),
};

export const cyberCafeAPI = {
  getAll: () => api.get('/cyber-cafes'),
  getNearest: (latitude, longitude, limit = 10) =>
    api.get(`/cyber-cafes/nearest?latitude=${latitude}&longitude=${longitude}&limit=${limit}`),
  getById: (id) => api.get(`/cyber-cafes/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllRequests: () => api.get('/admin/requests'),
  updateRequestStatus: (id, status, adminNotes) =>
    api.patch(`/admin/requests/${id}/status`, { status, adminNotes }),
};

export default api;

