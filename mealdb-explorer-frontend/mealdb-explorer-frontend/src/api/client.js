import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed in future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          error.message = data.message || 'Resource not found';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        case 502:
          error.message = 'External API error. Please try again.';
          break;
        default:
          error.message = data.message || 'An error occurred';
      }
    } else if (error.request) {
      // Request made but no response
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      error.message = 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;