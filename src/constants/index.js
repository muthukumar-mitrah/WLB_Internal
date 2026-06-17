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
  BUDDIES: 'Buddies',
  CREATE_POST: 'CreatePost',
  NOTIFICATIONS: 'Notifications',
  ROBI: 'Robi',
  CONTACT_US: 'ContactUs',
  TERMS_OF_USE: 'TermsOfUse',
  PRIVACY_POLICY: 'PrivacyPolicy',
  WEB_VIEW_SCREEN: 'WebViewScreen',
  BLOCKED_USER: 'BlockedUser',
  AWARDS: 'awards',
  LEADER_BOARD: 'leaderBoard',

  // Profile
  PROFILE_NAVIGATOR: 'ProfileNavigator',
  PROFILE: 'Profile',
  MY_PROFILE: 'MyProfile',
  VIEW_PROFILE: 'ViewProfile',
  UPDATE_PROFILE: 'UpdateProfile',
  PORTRAIT_VIEW: 'PortraitView',
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
  APP_IMAGES
};
