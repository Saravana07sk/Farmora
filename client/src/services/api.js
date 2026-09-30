import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrilink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('agrilink_token')) {
        localStorage.removeItem('agrilink_token');
        localStorage.removeItem('agrilink_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
