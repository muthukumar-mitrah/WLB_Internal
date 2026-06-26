import React, { useEffect, useState, useMemo } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeContainer, Header, AppText } from '../../../components/common';
import { useTheme } from '../../../theme';
import aiBuddyService from '../../../api/services/aiBuddyService';
import ProfileScreenContent from '../../profile/components/ProfileScreenContent';
import { createStyles } from './styles';

const AIBuddyDetailsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { buddyId } = route.params || {};

  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);

  const [buddy, setBuddy] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buddyRes, feedRes] = await Promise.all([
          aiBuddyService.getBuddyById(buddyId),
          aiBuddyService.getBuddyFeed(buddyId)
        ]);
        setBuddy(buddyRes.data);
        setFeed(feedRes.data);
      } catch (error) {
        console.error('Failed to load buddy details', error);
      } finally {
        setLoading(false);
      }
    };
    if (buddyId) fetchData();
  }, [buddyId]);

  const formattedProfile = useMemo(() => {
    if (!buddy) return null;
    return {
      id: buddy.id,
      name: buddy.name,
      bio: `${buddy.role}\n\n${buddy.about}`,
      postCount: 32,
      followingCount: 234,
      followersCount: 354,
      buddiesCount: 0,
      posts: feed.map(post => ({
        id: post.id,
        authorName: buddy.name,
        timeAgo: post.timeAgo,
        content: post.text,
        image: post.image,
        video: post.video,
        likesCount: post.likes,
        commentsCount: post.comments,
        sharesCount: post.shares,
        saved: post.saved,
        liked: post.liked,
      })),
    };
  }, [buddy, feed]);

  const renderScreenState = content => (
    <SafeContainer edges={['top', 'bottom']}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.primarySurface}
        translucent={false}
      />
      <Header
        title={t('aiBuddy.details.title')}
        onBackPress={() => navigation.goBack()}
      />
      {content}
    </SafeContainer>
  );

  if (!buddy && !loading) {
    return renderScreenState(
      <View style={styles.centerContainer}>
        <AppText variant="bodyLarge" color={colors.textSecondary}>Buddy not found</AppText>
      </View>
    );
  }

  if (loading || !formattedProfile) {
    return renderScreenState(
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ProfileScreenContent
      navigation={navigation}
      isOwnProfile={false}
      isAIBuddy={true}
      profile={formattedProfile}
      avatar={buddy.image}
      headerTitle={t('aiBuddy.details.title')}
    />
  );
};

export default React.memo(AIBuddyDetailsScreen);
