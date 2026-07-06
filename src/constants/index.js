/**
 * Global app constants
 */
import { Dimensions, Platform } from 'react-native';
import { APP_IMAGES } from './images';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design dimensions (from design spec/Figma)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const SCALE_FACTOR = SCREEN_WIDTH / BASE_WIDTH;
const VERTICAL_SCALE_FACTOR = SCREEN_HEIGHT / BASE_HEIGHT;

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
const IS_TABLET = SCREEN_WIDTH >= 768;

// App info
const APP_NAME = 'Weight Loss Buddy';
const APP_VERSION = '1.0.0';

// API
const API_TIMEOUT = 30000; // 30s

// Pagination
const PAGE_SIZE = 20;

// AsyncStorage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@wlb/auth_token',
  REFRESH_TOKEN: '@wlb/refresh_token',
  USER_PROFILE: '@wlb/user_profile',
  THEME_MODE: '@wlb/theme_mode',
  ONBOARDING_DONE: '@wlb/onboarding_done',
  AI_BUDDY_DISCLAIMER_ACCEPTED: '@wlb/ai_buddy_disclaimer_accepted',
};

// Navigation routes
const ROUTES = {
  // Auth
  AUTH: 'Auth',
  SIGN_UP: 'SignUp',
  SETUP_PROFILE: 'SetupProfile',
  LOGIN: 'Login',
  LOGIN_PASSWORD: 'LoginPassword',
  BASIC_INFO: 'BasicInfo',
  BASIC_INFO2: 'BasicInfo2',
  WELCOME_SURVEY: 'WelcomeSurvey',
  SURVEY_Q1: 'SurveyQ1',
  SURVEY_Q2: 'SurveyQ2',
  SURVEY_Q3: 'SurveyQ3',
  SURVEY_Q4: 'SurveyQ4',
  SURVEY_Q5: 'SurveyQ5',
  SURVEY_Q6: 'SurveyQ6',
  SURVEY_Q7: 'SurveyQ7',
  SURVEY_Q8: 'SurveyQ8',
  SURVEY_Q9: 'SurveyQ9',
  MATCH_LOADING: 'MatchLoading',
  MATCH_RESULT: 'MatchResult',
  AI_BUDDY: 'AiBuddy',
  FIND_EMMA: 'FindEmma',
  EXPLORE_MATCHES: 'ExploreMatches',
  FORGOT_PASSWORD: 'ForgotPassword',
  VERIFICATION_CODE: 'VerificationCode',
  CHANGE_PASSWORD: 'ChangePassword',
  PASSWORD_RESET_SUCCESS: 'PasswordResetSuccess',

  // Main App
  MAIN: 'Main',
  DRAWER: 'Drawer',
  HOME_TABS: 'HomeTabs',
  HOME: 'Home',
  POST_FILTER: 'PostFilter',
  BUDDIES: 'Buddies',
  FIND_SUPPORTIVE_BUDDIES: 'FindSupportiveBuddies',
  BUDDY_SEARCH_RESULT: 'BuddySearchResult',
  CREATE_POST: 'CreatePost',
  NOTIFICATIONS: 'Notifications',
  NOTIFICATION_SCREEN: 'NotificationScreen',
  ROBI: 'Robi',
  CONTACT_US: 'ContactUs',
  TERMS_OF_USE: 'TermsOfUse',
  PRIVACY_POLICY: 'PrivacyPolicy',
  WEB_VIEW_SCREEN: 'WebViewScreen',
  BLOCKED_USER: 'BlockedUser',
  AWARDS: 'awards',
  LEADER_BOARD: 'leaderBoard',
  CREATE_GROUP: 'CreateGroup',
  GROUP_DETAILS: 'GroupDetails',
  EDIT_GROUP: 'EditGroup',

  // Profile
  PROFILE_NAVIGATOR: 'ProfileNavigator',
  PROFILE: 'Profile',
  MY_PROFILE: 'MyProfile',
  VIEW_PROFILE: 'ViewProfile',
  UPDATE_PROFILE: 'UpdateProfile',
  PORTRAIT_VIEW: 'PortraitView',
  EDIT_VIEW_PORTRAIT: 'EditViewPortrait',
  WEIGHT_UPDATE: 'WeightUpdate',
  PRIVACY_SELECTION: 'PrivacySelection',
  GENDER_SELECTION: 'GenderSelection',
  COUNTRY_SELECTION: 'CountrySelection',
  DOB_SELECTION: 'DobSelection',
  REPORT_USER: 'ReportUser',

  // AI Buddy
  CHOOSE_AI_BUDDY: 'ChooseAIBuddy',
  AI_BUDDY_DETAILS: 'AIBuddyDetails',
  AI_SETTINGS: 'AISettings',

  // Settings — Change Password flow (authenticated users)
  SETTINGS_CHANGE_PASSWORD: 'SettingsChangePassword',
  SETTINGS_FORGOT_PASSWORD: 'SettingsForgotPassword',
  SETTINGS_VERIFY_CODE: 'SettingsVerifyCode',
  SETTINGS_CREATE_PASSWORD: 'SettingsCreatePassword',
  SETTINGS_PASSWORD_SUCCESS: 'SettingsPasswordSuccess',

  // Account Settings
  ACCOUNT_SETTINGS: 'AccountSettings',
  PROFILE_VISIBILITY: 'ProfileVisibility',
  WEIGHT_VISIBILITY: 'WeightVisibility',
  TRACK_PROGRESS: 'TrackProgress',

  // Saved Posts
  SAVED_POSTS: 'SavedPosts',
};

// Remove once the real login API is integrated.
const MOCK_AUTH = {
  IDENTIFIER: 'saravana',
  PASSWORD: 'P@ssw0rd',
  TOKEN: 'mock-static-jwt-token',
};

// Regex patterns
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{9,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_%^&*()+=?/\\.,:;'"<>|~`{}[\]-])[A-Za-z\d@$!%*?&#_%^&*()+=?/\\.,:;'"<>|~`{}[\]-]{8,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
};

// Error messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
};

const GOOGLE_SIGN_IN_CONFIG = {
  webClientId: '437241230236-8a7di109k3qqe2vva5oughh3cfs24dlm.apps.googleusercontent.com',
  iosClientId: "437241230236-ad70fb4vipefk42a36m5tgf4e77ppqs5.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true
}

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};


// ── Profile ───────────────────────────────────────────────────────────────────
const MOCK_PROFILE = {
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
  unit: 'lbs',
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

const MOCK_PROFILES = [
  { id: '101', name: 'John Smith', location: 'United States', followers: 10, buddies: 5 },
  { id: '102', name: 'Emma Wilson', location: 'United Kingdom', followers: 20, buddies: 8 },
  { id: '103', name: 'Michael Davis', location: 'Canada', followers: 15, buddies: 3 },
  { id: '104', name: 'Sophia Brown', location: 'Australia', followers: 30, buddies: 12 },
  { id: '105', name: 'Robert Taylor', location: 'New Zealand', followers: 5, buddies: 1 },
];


// ── Tabs ──────────────────────────────────────────────────────────────────────
const PROFILE_TABS = [
  'Posts',
  'Activities',
  'All',
  'Photos',
  'Videos',
];

const BUDDY_PROFILE_TABS = [
  'All Posts',
  'Photos',
  'Text',
  'Videos',
];

const NOTIFICATION_TABS = [
  'All',
  'Unread',
  'Buddies',
];

const SAVED_POST_TABS = [
  'All',
  'Text',
  'Photos',
  'Videos',
  'Groups',
];

// ── Report Options ────────────────────────────────────────────────────────────
const REPORT_OPTIONS = [
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

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BASE_WIDTH,
  BASE_HEIGHT,
  SCALE_FACTOR,
  VERTICAL_SCALE_FACTOR,
  IS_IOS,
  IS_ANDROID,
  IS_TABLET,
  APP_NAME,
  APP_VERSION,
  API_TIMEOUT,
  PAGE_SIZE,
  STORAGE_KEYS,
  ROUTES,
  MOCK_AUTH,
  REGEX,
  ERROR_MESSAGES,
  HTTP_STATUS,
  GOOGLE_SIGN_IN_CONFIG,
  APP_IMAGES,
  MOCK_PROFILE,
  MOCK_PROFILES,
  PROFILE_TABS,
  BUDDY_PROFILE_TABS,
  REPORT_OPTIONS,
  NOTIFICATION_TABS,
  SAVED_POST_TABS,
};
