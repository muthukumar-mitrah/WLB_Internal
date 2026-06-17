import { AI_BUDDIES, MOCK_BUDDY_FEED } from '../../constants/aiBuddyConstants';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getAIBuddies = async () => {
  await delay();
  return { data: AI_BUDDIES };
};

const getBuddyById = async (id) => {
  await delay();
  const buddy = AI_BUDDIES.find(b => b.id === id);
  if (!buddy) {
    throw new Error('Buddy not found');
  }
  return { data: buddy };
};

const getBuddyFeed = async (buddyId) => {
  await delay();
  const buddy = AI_BUDDIES.find(b => b.id === buddyId);
  if (!buddy) {
    throw new Error('Buddy not found');
  }
  // For the sake of the mock, return the same mock feed but maybe with the buddy's username and avatar to match
  const feed = MOCK_BUDDY_FEED.map(post => ({
    ...post,
    username: buddy.name,
    avatar: buddy.image,
    userId: buddy.id
  }));
  return { data: feed };
};

const aiBuddyService = {
  getAIBuddies,
  getBuddyById,
  getBuddyFeed,
};

export default aiBuddyService;
