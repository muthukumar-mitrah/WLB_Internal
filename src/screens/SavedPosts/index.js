/**
 * SavedPostsScreen
 *
 * Displays the user's saved posts, filterable by five tabs:
 *   All · Text · Photos · Videos · Groups
 *
 * Reuses:
 *  • Header         — common/Header.js
 *  • Tabs           — common/Tabs/index.js
 *  • PostCard       — screens/home/Feed/index.js
 *  • SafeContainer  — common/SafeContainer.js
 *  • EmptyState     — common/EmptyState.js
 *  • SavedPostsContext — context/SavedPostsContext.js
 *
 * Post-type handling (all via PostCard props, no wrappers needed):
 *  • Text posts     — post.text only
 *  • Feeling posts  — post.feeling → PostCard renders "is feeling X" inline
 *  • Photo posts    — post.image
 *  • Video posts    — post.image + post.videoDuration → PostCard renders
 *                     play-button overlay and duration badge
 *  • Group posts    — username = group name, timeAgo = "member · time"
 */
import React, { memo, useCallback, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../theme';
import { Header, Tabs, SafeContainer, EmptyState } from '../../components/common';
import PostCard from '../home/Feed';
import { SavedPostsProvider, useSavedPosts } from '../../context/SavedPostsContext';
import { SAVED_POST_TABS } from '../../constants';
import createStyles from './styles';

// ── Inner screen — consumes context ──────────────────────────────────────────

const SavedPostsContent = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const { filteredPosts, activeTab, setActiveTab, likePost, removePost } = useSavedPosts();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLikePress = useCallback((postId) => likePost(postId), [likePost]);

  // Pressing the Robi/save icon on a saved post removes it from the list
  const handleSavePress = useCallback((postId) => removePost(postId), [removePost]);

  const handleMenuPress    = useCallback(() => { /* TODO: PostOptionsSheet */ }, []);
  const handleCommentPress = useCallback(() => { /* TODO: CommentsBottomSheet */ }, []);
  const handleSharePress   = useCallback(() => { /* TODO: ShareBottomSheet */ }, []);

  // ── List helpers ──────────────────────────────────────────────────────────
  const keyExtractor = useCallback((item) => item.id, []);

  const ItemSeparator = useCallback(() => <View style={styles.separator} />, [styles]);

  const renderItem = useCallback(({ item }) => (
    <PostCard
      post={item}
      onLikePress={handleLikePress}
      onSavePress={handleSavePress}
      onMenuPress={handleMenuPress}
      onCommentPress={handleCommentPress}
      onSharePress={handleSharePress}
    />
  ), [handleLikePress, handleSavePress, handleMenuPress, handleCommentPress, handleSharePress]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.safeArea}>
      {/* Header */}
      <Header
        title="Saved Post"
        titleAlign="left"
        showBack
      />

      {/* Tabs */}
      <Tabs
        tabs={SAVED_POST_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Posts list */}
      <FlatList
        data={filteredPosts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <EmptyState
            icon={
              <MaterialIcons
                name="bookmark-border"
                size={48}
                color={colors.textTertiary}
              />
            }
            title="No saved posts"
            description="Posts you save will appear here."
            style={styles.emptyState}
          />
        }
      />
    </SafeContainer>
  );
};

// ── Root — wraps content in its context provider ──────────────────────────────

const SavedPostsScreen = () => (
  <SavedPostsProvider>
    <SavedPostsContent />
  </SavedPostsProvider>
);

export default memo(SavedPostsScreen);
