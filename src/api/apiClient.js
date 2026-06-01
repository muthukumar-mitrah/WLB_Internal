/**
 * Axios API client with interceptors
 * Handles auth tokens, refresh, and error transformation
 */
import axios from 'axios';
import {STORAGE_KEYS, API_TIMEOUT, ERROR_MESSAGES} from '../constants';
import {storage} from '../utils/storage';

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = 'https://api.yourdomain.com/v1'; // Replace with actual URL

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async config => {
    const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle 401 - attempt token refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retried
    ) {
      originalRequest._retried = true;
      try {
        const refreshToken = await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const {data} = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed — clear tokens and propagate
        await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
