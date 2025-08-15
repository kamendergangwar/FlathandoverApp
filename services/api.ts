import axios from 'axios';
import { environmentConfig } from '@/config/environment';

// Force API configuration for builds
const API_BASE_URL = 'http://restlotterydev.cidcohomes.com/rest-api/applicationservice';
const API_TIMEOUT = 12000;
const ENV = 'preview';

console.log('=== API Service Configuration ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_TIMEOUT:', API_TIMEOUT);
console.log('ENV:', ENV);
console.log('environmentConfig:', environmentConfig);
console.log('Timestamp:', new Date().toISOString());
console.log('=== End API Configuration ===');

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or common headers here
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      console.log('Unauthorized access - user needs to login');
    } else if (error.response?.status === 500) {
      console.log('Server error - please try again later');
    } else if (error.code === 'ECONNABORTED') {
      console.log('Request timeout - please check your connection');
    } else if (error.code === 'NETWORK_ERROR') {
      console.log('Network error - please check your internet connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('Snagging/login', { username, password }),
};


export const snaggingAPI = {
  // Add other snagging-related API calls here
  getApplications: () => api.get('/applications'),
  submitReport: (data: any) => api.post('/submit-report', data),
  searchFlat: (searchValue: string, searchType: string) => {
    const payload = {
      applicantId: "",
      applicationNo: searchType === 'application' ? searchValue : "",
      MobileNo: searchType === 'mobile' ? searchValue : ""
    };
    return api.post('Snagging/search', payload);
  },
};

// Export configuration for debugging
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  environment: ENV,
};