import { 
  MOCK_PROFILE, 
  MOCK_PROFILES, 
  PROFILE_TABS,
  REPORT_OPTIONS
} from '../../constants/profileConstants';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getProfile = async () => {
  await delay();
  return { data: MOCK_PROFILE };
};

const updateProfile = async (payload) => {
  await delay();
  return { data: payload };
};

const getUsers = async () => {
  await delay();
  return { data: MOCK_PROFILES };
};

const getProfileTabs = async () => {
  await delay(100);
  return { data: PROFILE_TABS };
};

const getReportOptions = async () => {
  await delay(100);
  return { data: REPORT_OPTIONS };
};

const profileService = {
  getProfile,
  updateProfile,
  getUsers,
  getProfileTabs,
  getReportOptions,
};

export default profileService;
