import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost/rest-api/applicationservice/Snagging',
  timeout: 10000,
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
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirecting to login');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (username: string, password: string) =>
    api.post(`/login?username=${username}&password=${password}`),
};

export const snaggingAPI = {
  // Add other snagging-related API calls here
  getApplications: () => api.get('/applications'),
  submitReport: (data: any) => api.post('/submit-report', data),
};