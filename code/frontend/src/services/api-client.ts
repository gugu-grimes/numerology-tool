import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for RFC7807 error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.type) {
      // RFC7807 error format
      const err = error.response.data;
      console.error(`[${err.status}] ${err.title}: ${err.detail}`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;