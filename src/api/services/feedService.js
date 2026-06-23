/**
 * Feed service — all feed and post API calls
 */
import { MOCK_POSTS } from '../../utils/mockData';

const feedService = {
  // Get posts for a specific tab feed
  getFeed: tab => {
    // In production: return apiClient.get(`/feed`, { params: { tab } });
    // For development, simulate API response
    return Promise.resolve({
      data: MOCK_POSTS.filter(post => post.tab === tab || tab === 'trending'),
    });
  },

  // Like or unlike a post
  likePost: postId => {
    // In production: return apiClient.post(`/posts/${postId}/like`);
    return Promise.resolve({ success: true });
  },

  // Save or unsave a post
  savePost: postId => {
    // In production: return apiClient.post(`/posts/${postId}/save`);
    return Promise.resolve({ success: true });
  },
};

export default feedService;
