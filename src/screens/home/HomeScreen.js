/**
 * HomeScreen — Main home screen with header, top tabs, and feed placeholder.
 */
import React, {
  memo,
  useCallback,
  useState,
  useRef,
  useMemo,
} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { PostPreviewModal, EmptyState, CommentsBottomSheet, LikesBottomSheet, PostOptionsSheet, ShareBottomSheet } from '../../components/common';
import HomeHeader from '../../components/home/HomeHeader';
import TopTabs from '../../components/home/TopTabs';
import { useTranslation } from '../../i18n/useTranslation';
import { useFeed } from '../../context/FeedContext';
import { ROUTES, STORAGE_KEYS } from '../../constants';
import { storage } from '../../utils/storage';
import PostCard from './Feed';
import ProfileTabs from '../profile/components/ProfileTabs';
import MyGroupsTabContent from './MyGroupsTabContent';
import GroupPostsTabContent from './GroupPostsTabContent';
import AllGroupsTabContent from './AllGroupsTabContent';
import SortGroupsBottomSheet from './components/SortGroupsBottomSheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppText } from '../../components/common';
import FilterHeader from './FilterHeader';
import RobiQuickAnswerDisclaimerModal from './RobiQuickAnswerDisclaimerModal/index.js'

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const {
    posts,
    activeTab,
    setActiveTab,
    loading,
    likePost,
    savePost,
    refreshFeed,
  } = useFeed();

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [activeGroupTab, setActiveGroupTab] = useState(t('home.groupTabs.posts'));
  const [menuPost, setMenuPost] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedSortOption, setSelectedSortOption] = useState('newest');
  const commentsSheetRef = useRef(null);
  const likesSheetRef = useRef(null);
  const shareSheetRef = useRef(null);
  const sortSheetRef = useRef(null);
  const robiSheetRef = useRef(null);

  const groupTabs = useMemo(() => [
    t('home.groupTabs.posts'),
    t('home.groupTabs.myGroups'),
    t('home.groupTabs.allGroups'),
  ], [t]);

  const handleDisclaimerClose = useCallback(() => {
    setDisclaimerVisible(false);
  }, []);

  const handleMenuPress = useCallback((post) => {
    setMenuPost(post);
  }, []);
  const handleMenuClose = useCallback(() => setMenuPost(null), []);
  const handleImagePreview = useCallback((image) => setPreviewImage(image), []);
  const handleClosePreview = useCallback(() => setPreviewImage(null), []);

  const handleCommentPress = useCallback((post) => {
    commentsSheetRef.current?.open();
  }, []);

  const handleFilterPress = () => {
    navigation.navigate(ROUTES.POST_FILTER);
  };

const handleRobiFilterPress = useCallback(async () => {
    const accepted = await storage.getItem(
      STORAGE_KEYS.ROBI_QUICK_ANSWER_DISCLAIMER_ACCEPTED,
      false,
    );
    if(accepted === true) {
      robiSheetRef.current?.open();
    } else {
      setDisclaimerVisible(true);
    }
  }, []);

  const handleDisclaimerContinue = useCallback(async (dontShowAgain) => {
    if(dontShowAgain) {
      await storage.setItem(
        STORAGE_KEYS.ROBI_QUICK_ANSWER_DISCLAIMER_ACCEPTED,
        true,
      );
    }
    setDisclaimerVisible(false);
    robiSheetRef.current?.open();
  }, []);

  const handleSharePress = useCallback((post) => {
    if (!post) return;
    shareSheetRef.current?.open(post);
  }, []);

  const handleLikesCountPress = useCallback((post) => {
    likesSheetRef.current?.open(post.id);
  }, []);

  const handleSortFilterPress = useCallback(() => {
    sortSheetRef.current?.open();
  }, []);

  const handleSortApply = useCallback((val) => {
    setSelectedSortOption(val);
  }, []);

  const handleMenuSelect = useCallback((action) => {
    console.log('[FeedScreen] Post action:', action, 'on post:', menuPost?.id);
  }, [menuPost]);

  const handleAvatarPress = useCallback((post) => {
    if (!post) return;
    if (post.isGroupPost) {
      navigation.navigate(ROUTES.GROUP_DETAILS, { groupId: post.groupId, groupName: post.username });
    } else {
      navigation.navigate(ROUTES.VIEW_PROFILE, { userId: post.userId || post.username });
    }
  }, [navigation]);

  const renderPost = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        showChat={activeTab === 'buddies'}
        onLikePress={likePost}
        onSavePress={savePost}
        onMenuPress={handleMenuPress}
        onImagePreview={handleImagePreview}
        onCommentPress={handleCommentPress}
        onSharePress={handleSharePress}
        onLikesCountPress={handleLikesCountPress}
      />
    ),
    [
      activeTab,
      likePost,
      savePost,
      handleMenuPress,
      handleImagePreview,
      handleCommentPress,
      handleSharePress,
      handleLikesCountPress,
    ],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const isGroupsTab = activeTab === 'groups';

  const renderEmptyState = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (activeTab === 'buddies') {
      return (
        <EmptyState
          icon={
            <Image
              source={require('../../assets/images/buddies_not_found.png')}
              style={styles.emptyRobiImage}
              resizeMode="contain"
            />
          }
          title={t('home.emptyStates.buddies.title')}
          description={t('home.emptyStates.buddies.subtitle')}
          actionLabel={t('home.emptyStates.buddies.button')}
          actionVariant="primary"
          onAction={() => navigation.navigate(ROUTES.BUDDIES)}
          style={styles.emptyStateContainer}
        />
      );
    }

    return (
      <EmptyState
        title={t('home.emptyStates.noRecords')}
        style={styles.emptyStateContainer}
      />
    );
  }, [loading, activeTab, colors.primary, t, navigation]);

  const renderListHeader = useCallback(() => {
    if (activeTab === 'groups') {
      const createGroupButton = (
        <TouchableOpacity
          style={styles.createGroupBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(ROUTES.CREATE_GROUP)}
        >
          <Icon name="add-circle" size={22} color={colors.textPrimary} />
          <AppText style={[styles.createGroupText, { color: colors.textPrimary }]}>
            {t('home.groupTabs.createGroup')}
          </AppText>
        </TouchableOpacity>
      );

      return (
        <ProfileTabs
          tabs={groupTabs}
          activeTab={activeGroupTab}
          onTabChange={setActiveGroupTab}
          createGroupButton={createGroupButton}
        />
      );
    }
    return null;
  }, [activeTab, activeGroupTab, groupTabs, colors, t, navigation]);

  // Determine what to show in FlatList
  const listData = isGroupsTab ? [] : posts;

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.backgroundSecondary }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <HomeHeader />
      <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} colors={colors} />
      {activeTab === 'wlb' && (
        <FilterHeader
          onRobiPress={handleRobiFilterPress}
          onFilterPress={handleFilterPress}
        />
      )}
      {isGroupsTab ? (
        <>
          {renderListHeader()}
          {activeGroupTab === t('home.groupTabs.posts') && (
            <GroupPostsTabContent
              onMenuPress={handleMenuPress}
              onCommentPress={handleCommentPress}
              onSharePress={handleSharePress}
              onLikesCountPress={handleLikesCountPress}
              onImagePreview={handleImagePreview}
              onAvatarPress={handleAvatarPress}
            />
          )}
          {activeGroupTab === t('home.groupTabs.myGroups') && (
            <MyGroupsTabContent
              onMenuPress={handleMenuPress}
              onCommentPress={handleCommentPress}
              onSharePress={handleSharePress}
              onLikesCountPress={handleLikesCountPress}
              onImagePreview={handleImagePreview}
              onAvatarPress={handleAvatarPress}
              selectedSortOption={selectedSortOption}
              onFilterPress={handleSortFilterPress}
            />
          )}
          {activeGroupTab === t('home.groupTabs.allGroups') && (
            <AllGroupsTabContent
              selectedSortOption={selectedSortOption}
              onFilterPress={handleSortFilterPress}
            />
          )}
        </>
      ) : (
        <FlatList
          data={listData}
          renderItem={renderPost}
          keyExtractor={keyExtractor}
          style={styles.feedList}
          contentContainerStyle={listData.length === 0 ? styles.feedContentEmpty : styles.feedContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
          ListEmptyComponent={renderEmptyState}
          refreshing={loading}
          onRefresh={refreshFeed}
        />
      )}
      <PostOptionsSheet
        visible={!!menuPost}
        username={menuPost?.username ?? ''}
        onClose={handleMenuClose}
        onSelect={handleMenuSelect}
      />
      <PostPreviewModal
        visible={!!previewImage}
        image={previewImage}
        onClose={handleClosePreview}
      />
      <CommentsBottomSheet
        ref={commentsSheetRef}
      />
      <LikesBottomSheet
        ref={likesSheetRef}
      />
      <ShareBottomSheet
        ref={shareSheetRef}
      />
      <RobiQuickAnswerDisclaimerModal
        visible={disclaimerVisible}
        onClose={handleDisclaimerClose}
        onContinue={handleDisclaimerContinue}
      />
      <SortGroupsBottomSheet
        ref={sortSheetRef}
        selectedValue={selectedSortOption}
        onApply={handleSortApply}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { 
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  logoImage: {
    width: 150,
    height: 38,
    bottom: 3,
    left: 6
  },
  logoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarIconBtn: {
    padding: 4,
  },
  topBarAvatar: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  feedList: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 3,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRobiImage: {
    width: 150,
    height: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  feedContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  createGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 8,
  },
  createGroupText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '700',
  },
});

export default memo(HomeScreen);
