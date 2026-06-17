import React, { useEffect, useState, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
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

  if (!buddy && !loading) {
    return (
      <SafeContainer edges={['top', 'bottom']}>
        <Header title={t('aiBuddy.details.title', 'AI Buddy Profile')} onBackPress={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <AppText variant="bodyLarge" color={colors.textSecondary}>Buddy not found</AppText>
        </View>
      </SafeContainer>
    );
  }

  if (loading || !formattedProfile) {
    return (
      <SafeContainer edges={['top', 'bottom']}>
        <Header title={t('aiBuddy.details.title', 'AI Buddy Profile')} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeContainer>
    );
  }

  return (
    <ProfileScreenContent
      navigation={navigation}
      isOwnProfile={false}
      isAIBuddy={true}
      profile={formattedProfile}
      avatar={buddy.image}
      headerTitle={t('aiBuddy.details.title', 'AI Buddy Profile')}
    />
  );
};

export default React.memo(AIBuddyDetailsScreen);
