import { MOCK_MY_GROUPS, MOCK_GROUP_POSTS } from '../../utils/mockData';

const groupService = {
  getMyGroups: () => {
    return Promise.resolve({ data: MOCK_MY_GROUPS });
  },

  getGroupPosts: (groupId) => {
    const posts = groupId
      ? MOCK_GROUP_POSTS.filter((p) => p.groupId === groupId)
      : MOCK_GROUP_POSTS;
    return Promise.resolve({ data: posts });
  },

  likeGroupPost: (postId) => {
    return Promise.resolve({ success: true });
  },

  saveGroupPost: (postId) => {
    return Promise.resolve({ success: true });
  },

  getAllGroups: () => {
    return Promise.resolve({ data: MOCK_MY_GROUPS });
  },

  joinGroup: (groupId) => {
    return Promise.resolve({ success: true });
  },

  createGroup: (groupData) => {
    return Promise.resolve({ success: true, data: { id: 'g_new', ...groupData, totalMembers: 1 } });
  },
};

export default groupService;
