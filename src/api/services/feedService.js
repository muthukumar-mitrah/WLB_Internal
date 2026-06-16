/**
 * Feed service — all feed and post API calls
 */
import { APP_IMAGES } from '../../constants/images';

// Mock posts data representing feed screenshots
export const MOCK_POSTS = [
  {
    id: '1',
    username: 'MGIGD17',
    currentWeight: '64kgs',
    timeAgo: '12h ago',
    text: 'Shed those extra pounds and embrace a healthier, more vibrant you! Discover new ways to stay active, nourish your body, and boost your confidence along the journey to wellness!',
    image: require('../../assets/images/find_robi.png'),
    likes: 12,
    comments: 32,
    shares: 15,
    saved: false,
    liked: false,
    avatar: APP_IMAGES.userAvatar,
    tab: 'trending',
  },
  {
    id: '2',
    username: 'Alexandra Smith',
    currentWeight: '67kgs',
    timeAgo: '2d ago',
    text: 'Transform your life by losing unwanted pounds and embracing a healthier, more energetic you! Discover new ways to stay active, nourish your body, and boost your self-esteem on your wellness journey!',
    image: require('../../assets/images/find_buddy.png'),
    likes: 24,
    comments: 8,
    shares: 5,
    saved: true,
    liked: false,
    avatar: APP_IMAGES.profileAvatar,
    tab: 'trending',
  },
  {
    id: '3',
    username: 'FitJourney22',
    currentWeight: '78kgs',
    timeAgo: '4h ago',
    text: 'Just completed my first 5K run! 🏃‍♂️ Small steps every day lead to big transformations. Keep pushing forward, your future self will thank you!',
    image: require('../../assets/images/survey_dance.png'),
    likes: 47,
    comments: 19,
    shares: 11,
    saved: false,
    liked: false,
    avatar: APP_IMAGES.userAvatar,
    tab: 'wlb',
  },
  {
    id: '4',
    username: 'HealthyHannah',
    currentWeight: '58kgs',
    timeAgo: '1d ago',
    text: 'Meal prep Sunday done right! 🥗 Prepared 5 days worth of balanced meals. Planning ahead makes staying on track so much easier.',
    image: null,
    likes: 63,
    comments: 14,
    shares: 22,
    saved: false,
    liked: false,
    avatar: APP_IMAGES.profileAvatar,
    tab: 'wlb', // Moved from 'buddies' to make the Buddies tab initially empty
  },
];

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
