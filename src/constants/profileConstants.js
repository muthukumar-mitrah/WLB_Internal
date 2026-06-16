import { APP_IMAGES } from './images';

// ── Profile ───────────────────────────────────────────────────────────────────
export const MOCK_PROFILE = {
  id: '1',
  name: 'Jaclyn',
  bio: 'New here · Building healthy habits one day at a time.',
  gender: 'Female',
  country: 'United States',
  dateOfBirth: 'Oct 1, 2005',
  avatar: APP_IMAGES.userAvatar, 
  postCount: 10,
  followingCount: 20,
  followersCount: 15,
  buddiesCount: 20,
  totalPoints: 200,
  weeklyPoints: 20,
  startWeight: 150,
  currentWeight: 144,
  goalWeight: 140,
  posts: [
    {
      id: 'post-1',
      authorName: 'Jaclyn',
      authorAvatar: APP_IMAGES.userAvatar,
      currentWeight: '144lbs',
      timeAgo: '12h ago',
      content: 'Shed those extra pounds and embrace a healthier, more vibrant you! Discover new ways to stay active, nourish your body, and boost your confidence along the journey to wellness!',
      image: APP_IMAGES.survey1,
      likesCount: 12,
      commentsCount: 32,
      sharesCount: 15,
    },
    {
      id: 'post-2',
      authorName: 'Jaclyn',
      authorAvatar: APP_IMAGES.userAvatar,
      currentWeight: '144lbs',
      timeAgo: '1d ago',
      content: 'Consistency is key. 🔑 Small steps every day lead to massive results over time. Keep pushing towards your goals!',
      image: APP_IMAGES.survey2,
      likesCount: 45,
      commentsCount: 8,
      sharesCount: 2,
    },
    {
      id: 'post-3',
      authorName: 'Jaclyn',
      authorAvatar: APP_IMAGES.userAvatar,
      currentWeight: '144lbs',
      timeAgo: '2d ago',
      content: 'Meal prep Sunday! Ready for a successful week of healthy eating. What are you prepping today?',
      image: null,
      likesCount: 89,
      commentsCount: 15,
      sharesCount: 5,
    },
    {
      id: 'post-4',
      authorName: 'Jaclyn',
      authorAvatar: APP_IMAGES.userAvatar,
      currentWeight: '144lbs',
      timeAgo: '3d ago',
      content: 'Just hit my step goal for the day! 🏃‍♀️ 10,000 steps and feeling great.',
      image: APP_IMAGES.survey3,
      likesCount: 112,
      commentsCount: 24,
      sharesCount: 8,
    },
    {
      id: 'post-5',
      authorName: 'Jaclyn',
      authorAvatar: APP_IMAGES.userAvatar,
      currentWeight: '144lbs',
      timeAgo: '5d ago',
      content: 'Hydration check! 💧 Remember to drink your water today. It makes such a difference in energy levels.',
      image: null,
      likesCount: 67,
      commentsCount: 12,
      sharesCount: 1,
    },
  ],
};

export const MOCK_PROFILES = [
  { id: '101', name: 'John Smith', location: 'United States', followers: 10, buddies: 5 },
  { id: '102', name: 'Emma Wilson', location: 'United Kingdom', followers: 20, buddies: 8 },
  { id: '103', name: 'Michael Davis', location: 'Canada', followers: 15, buddies: 3 },
  { id: '104', name: 'Sophia Brown', location: 'Australia', followers: 30, buddies: 12 },
  { id: '105', name: 'Robert Taylor', location: 'New Zealand', followers: 5, buddies: 1 },
];


// ── Tabs ──────────────────────────────────────────────────────────────────────
export const PROFILE_TABS = [
  'Posts',
  'Activities',
  'All',
  'Photos',
  'Videos',
];

// ── Report Options ────────────────────────────────────────────────────────────
export const REPORT_OPTIONS = [
  "It's spam",
  "I just don't like it",
  "Bullying or unwanted contact",
  "Suicide, self-injury or eating disorders",
  "Violence, hate or exploitation",
  "Selling or promoting restricted items",
  "Nudity or sexual activity",
  "Scam or fraud",
  "False information"
];
