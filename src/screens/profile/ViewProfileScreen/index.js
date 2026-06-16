import React, { memo, useMemo } from 'react';
import ProfileScreenContent from '../components/ProfileScreenContent';
import { useProfile } from '../../../context/ProfileContext';
import { MOCK_PROFILE } from '../../../constants/profileConstants';

const ViewProfileScreen = ({ navigation }) => {
  const { allUsers } = useProfile();
  
  // Use a fallback user from allUsers or mock a structure
  const profile = useMemo(() => {
    const user = allUsers?.[0] || { name: 'User' };
    return {
      id: user.id || '2',
      name: user.name,
      bio: 'New here · Building healthy habits one day at a time.',
      gender: 'Female',
      country: 'United States',
      dateOfBirth: 'Oct 1, 1984',
      avatar: user.avatar,
      postCount: 0, followingCount: 1, followersCount: 0, buddiesCount: 0, totalPoints: 0, weeklyPoints: 0 ,
      startWeight: 150, currentWeight: 144, goalWeight: 140,
      posts: MOCK_PROFILE.posts || [],
    };
  }, [allUsers]);

  return (
    <ProfileScreenContent
      navigation={navigation}
      isOwnProfile={false}
      profile={profile}
    />
  );
};

export default memo(ViewProfileScreen);
