import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    localStorage.removeItem('token');
    // Instead of redirecting, we'll let the component handle the error
    return Promise.reject(error);
  }
  return Promise.reject(error);
});

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const login = async (nicNumber, password) => {
  try {
    const response = await api.post('/auth/login', { nicNumber, password });
    return response;
  } catch (error) {
    return { error: error.response?.data?.message || 'Login failed. Please try again.' };
  }
};

export const processItemCode = (serialNumber) => api.post('/api/process-item', { serialNumber });
export const getDashboard = () => api.get('/api/dashboard');
export const scanQR = (serialNumber) => api.post('/api/scan', { serialNumber });
export const requestPayout = () => api.post('/api/payout');

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return { isAuthenticated: false };
  }
  try {
    const response = await api.get('/auth/check-auth');
    return { isAuthenticated: true, user: response.data };
  } catch (error) {
    localStorage.removeItem('token');
    return { isAuthenticated: false };
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Admin endpoints
export const getProducts = () => api.get('/api/admin/products');
export const addProduct = (productData) => api.post('/api/admin/products', productData);
export const deleteProduct = (productId) => api.delete(`/api/admin/products/${productId}`);
export const getUsers = () => api.get('/api/admin/users');

export default api;