import React, {
  memo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import { EmptyState } from '../../components/common';
import groupService from '../../api/services/groupService';
import PostCard from './Feed';

const GroupPostsTabContent = ({
  onMenuPress,
  onCommentPress,
  onSharePress,
  onLikesCountPress,
  onImagePreview,
  onAvatarPress,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [groupPosts, setGroupPosts] = useState([]);
  const [groupPostsLoading, setGroupPostsLoading] = useState(false);

  const fetchGroupPosts = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) setGroupPostsLoading(true);
    try {
      const res = await groupService.getGroupPosts();
      const mapped = res.data.map((gp) => ({
        id: gp.id,
        username: gp.groupName,
        groupUserName: gp.userName,
        avatar: gp.groupImage,
        text: gp.postDescription,
        image: gp.postImage,
        timeAgo: gp.createdAt,
        likes: gp.likeCount,
        comments: gp.commentCount,
        shares: gp.shareCount,
        liked: gp.liked,
        saved: gp.saved,
        currentWeight: '',
        userId: gp.userId,
      }));
      setGroupPosts(mapped);
    } catch (err) {
      console.warn('[GroupPostsTabContent] Error fetching group posts:', err);
    } finally {
      if (!isRefreshing) setGroupPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroupPosts();
  }, [fetchGroupPosts]);

  const handleLikeGroupPost = useCallback((postId) => {
    setGroupPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      }),
    );
    groupService.likeGroupPost(postId).catch(() => {
      setGroupPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const prevLiked = !p.liked;
            return {
              ...p,
              liked: prevLiked,
              likes: prevLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
            };
          }
          return p;
        }),
      );
    });
  }, []);

  const handleSaveGroupPost = useCallback((postId) => {
    setGroupPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, saved: !p.saved };
        }
        return p;
      }),
    );
    groupService.saveGroupPost(postId).catch(() => {
      setGroupPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return { ...p, saved: !p.saved };
          }
          return p;
        }),
      );
    });
  }, []);

  const handleRefresh = useCallback(() => {
    fetchGroupPosts(true);
  }, [fetchGroupPosts]);

  const renderPost = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        colors={colors}
        isGroupPost
        onLikePress={handleLikeGroupPost}
        onSavePress={handleSaveGroupPost}
        onMenuPress={onMenuPress}
        onImagePreview={onImagePreview}
        onCommentPress={onCommentPress}
        onSharePress={onSharePress}
        onLikesCountPress={onLikesCountPress}
        onAvatarPress={() => onAvatarPress?.(item)}
      />
    ),
    [
      colors,
      handleLikeGroupPost,
      handleSaveGroupPost,
      onMenuPress,
      onImagePreview,
      onCommentPress,
      onSharePress,
      onLikesCountPress,
      onAvatarPress,
    ],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderEmptyState = useCallback(() => {
    if (groupPostsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return (
      <EmptyState
        title={t('home.myGroups.emptyPosts')}
        style={styles.emptyStateContainer}
      />
    );
  }, [groupPostsLoading, colors.primary, t]);

  if (groupPostsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <FlatList
        data={groupPosts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        style={styles.postsList}
        contentContainerStyle={
          groupPosts.length === 0
            ? styles.postsContentEmpty
            : styles.postsContent
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
        ListEmptyComponent={renderEmptyState}
        refreshing={groupPostsLoading}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postsList: {
    flex: 1,
  },
  postsContent: {
    paddingVertical: 3,
  },
  postsContentEmpty: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(GroupPostsTabContent);
