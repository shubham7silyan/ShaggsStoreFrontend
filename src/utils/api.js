import axios from 'axios';

// Set base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

// API utility functions
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => axios.post('/api/auth/login', credentials),
    register: (userData) => axios.post('/api/auth/register', userData),
    getProfile: () => axios.get('/api/auth/me'),
    updateProfile: (data) => axios.put('/api/auth/profile', data),
    changePassword: (data) => axios.put('/api/auth/change-password', data),
    forgotPassword: (email) => axios.post('/api/auth/forgot-password', { email })
  },

  // Product endpoints
  products: {
    getAll: (params = {}) => axios.get('/api/products', { params }),
    getById: (id) => axios.get(`/api/products/${id}`),
    create: (data) => axios.post('/api/products', data),
    update: (id, data) => axios.put(`/api/products/${id}`, data),
    delete: (id) => axios.delete(`/api/products/${id}`),
    addReview: (id, review) => axios.post(`/api/products/${id}/reviews`, review),
    getCategories: () => axios.get('/api/products/categories/list')
  },

  // Cart endpoints
  cart: {
    get: () => axios.get('/api/cart'),
    add: (productId, quantity) => axios.post('/api/cart/add', { productId, quantity }),
    update: (productId, quantity) => axios.put('/api/cart/update', { productId, quantity }),
    remove: (productId) => axios.delete(`/api/cart/remove/${productId}`),
    clear: () => axios.delete('/api/cart/clear'),
    getSummary: () => axios.get('/api/cart/summary')
  },

  // Order endpoints
  orders: {
    create: (orderData) => axios.post('/api/orders', orderData),
    getAll: (params = {}) => axios.get('/api/orders', { params }),
    getById: (id) => axios.get(`/api/orders/${id}`),
    cancel: (id) => axios.put(`/api/orders/${id}/cancel`),
    processPayment: (paymentData) => axios.post('/api/orders/payment/process', paymentData)
  },

  // User endpoints
  users: {
    addAddress: (address) => axios.post('/api/users/addresses', address),
    updateAddress: (addressId, address) => axios.put(`/api/users/addresses/${addressId}`, address),
    deleteAddress: (addressId) => axios.delete(`/api/users/addresses/${addressId}`),
    getWishlist: () => axios.get('/api/users/wishlist'),
    addToWishlist: (productId) => axios.post(`/api/users/wishlist/${productId}`),
    removeFromWishlist: (productId) => axios.delete(`/api/users/wishlist/${productId}`)
  },

  // Admin endpoints
  admin: {
    getDashboard: () => axios.get('/api/admin/dashboard'),
    getOrders: (params = {}) => axios.get('/api/admin/orders', { params }),
    updateOrderStatus: (orderId, status, trackingNumber) => 
      axios.put(`/api/admin/orders/${orderId}/status`, { status, trackingNumber }),
    getUsers: (params = {}) => axios.get('/api/admin/users', { params }),
    toggleUserStatus: (userId) => axios.put(`/api/admin/users/${userId}/toggle-status`),
    getSalesAnalytics: (period = '7d') => axios.get('/api/admin/analytics/sales', { params: { period } })
  }
};

// Request interceptor to add auth token
axios.interceptors.request.use(
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

// Response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
