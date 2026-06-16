import React, { memo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import ProfileScreenContent from '../components/ProfileScreenContent';
import { useProfile } from '../../../context/ProfileContext';
import { useTheme } from '../../../theme';

const MyProfileScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState(null);
  const { profile, loading } = useProfile();
  const { colors } = useTheme();

  // Wait until the profile is available
  const isProfileReady = profile;

  if (loading || !isProfileReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ProfileScreenContent
      navigation={navigation}
      isOwnProfile={true}
      profile={profile}
      avatar={avatar}
      onAvatarChange={setAvatar}
    />
  );
};

export default memo(MyProfileScreen);
