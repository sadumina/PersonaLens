/**
 * API Configuration
 * Axios instance with interceptors for authentication
 */
import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
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

// Response interceptor - Handle 401 errors intelligently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if user is on a protected page
      // Don't redirect if browsing public pages (history, etc)
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/history', '/login', '/register'];
      const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path));
      
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if trying to access protected resource
      if (!isPublicPath) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service methods
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const analysisAPI = {
  analyzeCV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/analyze/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHistory: (limit = 50) => api.get(`/analyze/history?limit=${limit}`),
  getAnalysisById: (analysisId) => api.get(`/analyze/${analysisId}`),
};

export default api;
