import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - redirect to login if needed
        // window.location.href = '/admin/login';
      }
      
      if (status === 403) {
        // Forbidden
        console.error('Access denied');
      }
      
      if (status === 500) {
        // Server error
        console.error('Server error:', data?.message || 'Something went wrong');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response received');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper for FormData requests (file uploads)
export const apiFormData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 60000, // Longer timeout for file uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Apply same interceptors to FormData instance
apiFormData.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Upload error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;