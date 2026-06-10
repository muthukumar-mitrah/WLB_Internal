/**
 * Auth service — all authentication API calls
 */
import apiClient from '../apiClient';

const authService = {
  signUp: payload => apiClient.post('/auth/signup', payload),

  login: payload => apiClient.post('/auth/login', payload),

  logout: () => apiClient.post('/auth/logout'),

  forgotPassword: payload => apiClient.post('/auth/forgot-password', payload),

  verifyOtp: payload => apiClient.post('/auth/verify-otp', payload),

  resetPassword: payload => apiClient.post('/auth/reset-password', payload),
};

export default authService;

