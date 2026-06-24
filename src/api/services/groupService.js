import { MOCK_MY_GROUPS, MOCK_GROUP_POSTS } from '../../utils/mockData';
import { APP_IMAGES } from '../../constants';

const groupService = {
  getMyGroups: () => {
    return Promise.resolve({ data: MOCK_MY_GROUPS });
  },

  getGroupDetails: (groupId) => {
    const baseGroup = MOCK_MY_GROUPS.find((g) => g.id === groupId) || {
      id: groupId || 'g1',
      groupName: 'Weight loss Buddies',
      groupImage: APP_IMAGES.findRobi,
      totalMembers: 1,
      status: 'joined',
    };

    return Promise.resolve({
      data: {
        id: baseGroup.id,
        groupName: baseGroup.groupName,
        groupDescription: 'Building healthy habits one day at a time.',
        groupCoverImage: baseGroup.groupCoverImage || null,
        groupProfileImage: baseGroup.groupImage,
        createdDate: '09 Jun 2026',
        privacyType: 'private',
        totalMembers: baseGroup.totalMembers,
        status: baseGroup.status,
        admin: {
          name: baseGroup.id === 'g2' ? 'Jaclyn' : 'Olivia K.',
          role: 'Group Creator',
          avatar: APP_IMAGES.profileAvatar,
        },
        activity: {
          postsToday: 'No new posts',
          postsThisMonth: 'No posts',
          totalMembers: baseGroup.totalMembers === 1 ? '1 member' : `${baseGroup.totalMembers} members`,
          newMembersThisWeek: '+1',
        },
      },
    });
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
