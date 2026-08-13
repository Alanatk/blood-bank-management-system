import axios from 'axios';

let rawBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Normalize base URL to always include /api
rawBaseUrl = rawBaseUrl.replace(/\/+$/, ''); // remove trailing slash
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl += '/api';
}

const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data) {
      customError = error.response.data.message || error.response.data.error || customError;
    } else if (error.request) {
      customError = 'Unable to connect to backend API server. Please make sure Flask is running on port 5000.';
    }
    return Promise.reject(new Error(customError));
  }
);

export default api;
