/**
 * HomeScreen — Main home screen with header, top tabs, and feed placeholder.
 */
import React, {
  memo,
  useCallback,
  useState,
  useRef,
} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { useTheme } from '../../theme';
import { PostPreviewModal, EmptyState, CommentsBottomSheet, LikesBottomSheet, PostOptionsSheet } from '../../components/common';
import HomeHeader from '../../components/home/HomeHeader';
import TopTabs from '../../components/home/TopTabs';
import { useTranslation } from '../../i18n/useTranslation';
import { useFeed } from '../../context/FeedContext';
import { ROUTES } from '../../constants';
import PostCard from './Feed';



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

  const [menuPost, setMenuPost] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const commentsSheetRef = useRef(null);
  const likesSheetRef = useRef(null);

  const handleMenuPress = useCallback((post) => {
    setMenuPost(post);
  }, []);
  const handleMenuClose = useCallback(() => setMenuPost(null), []);
  const handleImagePreview = useCallback((image) => setPreviewImage(image), []);
  const handleClosePreview = useCallback(() => setPreviewImage(null), []);

  const handleCommentPress = useCallback((post) => {
    commentsSheetRef.current?.open();
  }, []);

  const handleSharePress = useCallback(async (post) => {
    if (!post) return;
    const shareMessage = post.text || 'Check out this post on WLB!';
    const shareUrl = `https://wlb.app/post/${post.id}`;
    
    try {
      await Share.open({
        title: 'Share Post',
        message: `Check out this post by @${post.username} on Weight Loss Buddy:\n\n"${shareMessage}"`,
        url: shareUrl,
        failOnCancel: false,
      });
    } catch (e) {
      console.log('[SharePress] Native share error or cancelled:', e);
    }
  }, []);

  const handleLikesCountPress = useCallback((post) => {
    likesSheetRef.current?.open(post.id);
  }, []);

  const handleMenuSelect = useCallback((action) => {
    console.log('[FeedScreen] Post action:', action, 'on post:', menuPost?.id);
  }, [menuPost]);

  const handleAvatarPress = useCallback((post) => {
    if (!post) return;
    navigation.navigate(ROUTES.VIEW_PROFILE, { userId: post.userId || post.username });
  }, [navigation]);

  const renderPost = useCallback(({ item }) => (
    <PostCard
      post={item}
      colors={colors}
      showChat={activeTab === 'buddies'}
      onLikePress={likePost}
      onSavePress={savePost}
      onMenuPress={handleMenuPress}
      onImagePreview={handleImagePreview}
      onCommentPress={handleCommentPress}
      onSharePress={handleSharePress}
      onLikesCountPress={handleLikesCountPress}
      onAvatarPress={() => handleAvatarPress(item)}
    />
  ), [colors, activeTab, likePost, savePost, handleMenuPress, handleImagePreview, handleCommentPress, handleSharePress, handleLikesCountPress, handleAvatarPress]);

  const keyExtractor = useCallback((item) => item.id, []);

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
              source={require('../../assets/images/No_Buddies_Found.png')}
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

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.backgroundSecondary }]}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <HomeHeader />
      <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} colors={colors} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        style={styles.feedList}
        contentContainerStyle={posts.length === 0 ? styles.feedContentEmpty : styles.feedContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={refreshFeed}
      />
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
});

export default memo(HomeScreen);
