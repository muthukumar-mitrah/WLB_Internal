/**
 * User service — user profile API calls
 */
import apiClient from '../apiClient';

const userService = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: payload => apiClient.put('/user/profile', payload),
  uploadAvatar: formData =>
    apiClient.post('/user/avatar', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    }),
  deleteAccount: () => apiClient.delete('/user/account'),
};

export default userService;
