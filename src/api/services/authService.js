/**
 * Auth service — all authentication API calls
 */
import apiClient from '../apiClient';

const authService = {
  /**
   * Sign up with email
   * @param {Object} payload - { email, password, name }
   */
  signUp: payload => apiClient.post('/auth/signup', payload),

  /**
   * Log in with email & password
   * @param {Object} payload - { email, password }
   */
  login: payload => apiClient.post('/auth/login', payload),

  /**
   * Request OTP / magic link for social/email login
   */
  requestOtp: email => apiClient.post('/auth/otp/request', {email}),

  /**
   * Verify OTP
   */
  verifyOtp: (email, otp) => apiClient.post('/auth/otp/verify', {email, otp}),

  /**
   * Forgot password
   */
  forgotPassword: email => apiClient.post('/auth/forgot-password', {email}),

  /**
   * Reset password
   */
  resetPassword: (token, password) =>
    apiClient.post('/auth/reset-password', {token, password}),

  /**
   * Log out (invalidate server-side session)
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Social login (Google, Apple, Facebook)
   * @param {string} provider
   * @param {string} token - provider token
   */
  socialLogin: (provider, token) =>
    apiClient.post('/auth/social', {provider, token}),
};

export default authService;
