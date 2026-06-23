import React, {
  memo,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import { AppText, InputBox, EmptyState } from '../../components/common';
import { APP_IMAGES } from '../../constants/images';
import { fontFamily } from '../../theme/fonts';
import groupService from '../../api/services/groupService';
import PostCard from './Feed';

const GroupItem = memo(({ group, isSelected, onPress, colors }) => {
  const imageSource =
    typeof group.groupImage === 'string'
      ? { uri: group.groupImage }
      : group.groupImage;

  return (
    <TouchableOpacity
      style={styles.groupItem}
      activeOpacity={0.7}
      onPress={() => onPress(group)}
    >
      <View
        style={[
          styles.groupImageWrapper,
          {
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2.5 : 1.5,
          },
        ]}
      >
        <Image source={imageSource} style={styles.groupImage} resizeMode="cover" />
      </View>
      <AppText
        style={[styles.groupName, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {group.groupName}
      </AppText>
    </TouchableOpacity>
  );
});

const MyGroupsTabContent = ({
  onMenuPress,
  onCommentPress,
  onSharePress,
  onLikesCountPress,
  onImagePreview,
  onAvatarPress,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // ── Data fetching ──
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [groupsRes, postsRes] = await Promise.all([
          groupService.getMyGroups(),
          groupService.getGroupPosts(),
        ]);
        if (!cancelled) {
          setGroups(groupsRes.data);
          setPosts(postsRes.data);
        }
      } catch (err) {
        console.warn('[MyGroupsTabContent] Error fetching data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase().trim();
    return groups.filter((g) => g.groupName.toLowerCase().includes(q));
  }, [groups, searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!selectedGroupId) return posts;
    return posts.filter((p) => p.groupId === selectedGroupId);
  }, [posts, selectedGroupId]);

  const handleLikePost = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likeCount: nextLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1),
          };
        }
        return p;
      }),
    );
    groupService.likeGroupPost(postId).catch(() => {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const prevLiked = !p.liked;
            return {
              ...p,
              liked: prevLiked,
              likeCount: prevLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1),
            };
          }
          return p;
        }),
      );
    });
  }, []);

  const handleSavePost = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) return { ...p, saved: !p.saved };
        return p;
      }),
    );
    groupService.saveGroupPost(postId).catch(() => {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) return { ...p, saved: !p.saved };
          return p;
        }),
      );
    });
  }, []);

  const handleGroupSelect = useCallback((group) => {
    setSelectedGroupId((prev) => (prev === group.id ? null : group.id));
  }, []);

  const handleFilterPress = useCallback(() => {
    console.log('[MyGroupsTabContent] Filter pressed — placeholder action');
  }, []);

  const transformToPostCardData = useCallback((groupPost) => ({
    id: groupPost.id,
    username: groupPost.groupName,
    groupUserName: groupPost.userName,
    avatar: groupPost.groupImage,
    text: groupPost.postDescription,
    image: groupPost.postImage,
    timeAgo: groupPost.createdAt,
    likes: groupPost.likeCount,
    comments: groupPost.commentCount,
    shares: groupPost.shareCount,
    liked: groupPost.liked,
    saved: groupPost.saved,
    currentWeight: '',
    userId: groupPost.userId,
  }), []);

  const renderGroupItem = useCallback(
    ({ item }) => (
      <GroupItem
        group={item}
        isSelected={selectedGroupId === item.id}
        onPress={handleGroupSelect}
        colors={colors}
      />
    ),
    [selectedGroupId, handleGroupSelect, colors],
  );

  const renderPost = useCallback(
    ({ item }) => {
      const postData = transformToPostCardData(item);
      return (
        <PostCard
          post={postData}
          colors={colors}
          isGroupPost
          onLikePress={handleLikePost}
          onSavePress={handleSavePost}
          onMenuPress={onMenuPress}
          onImagePreview={onImagePreview}
          onCommentPress={onCommentPress}
          onSharePress={onSharePress}
          onLikesCountPress={onLikesCountPress}
          onAvatarPress={() => onAvatarPress?.(postData)}
        />
      );
    },
    [
      colors,
      transformToPostCardData,
      handleLikePost,
      handleSavePost,
      onMenuPress,
      onImagePreview,
      onCommentPress,
      onSharePress,
      onLikesCountPress,
      onAvatarPress,
    ],
  );

  const postKeyExtractor = useCallback((item) => item.id, []);
  const groupKeyExtractor = useCallback((item) => item.id, []);

  const renderEmptyPosts = useCallback(() => {
    if (loading) {
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
  }, [loading, colors.primary, t]);

  const searchIcon = useMemo(
    () => (
      <Image
        source={APP_IMAGES.search}
        style={[styles.searchIcon, { tintColor: colors.iconSecondary }]}
        resizeMode="contain"
      />
    ),
    [colors.iconSecondary],
  );

  const hasNoSearchResults = searchQuery.trim() && filteredGroups.length === 0;

  const renderListHeader = useCallback(() => {
    if (hasNoSearchResults) return null;
    return (
      <View style={[styles.groupsSection, { backgroundColor: colors.background }]}>
        <FlatList
          data={filteredGroups}
          renderItem={renderGroupItem}
          keyExtractor={groupKeyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.groupsListContent}
        />
      </View>
    );
  }, [hasNoSearchResults, filteredGroups, renderGroupItem, groupKeyExtractor, colors]);

  if (loading) {
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
      <View style={[styles.searchRow, { backgroundColor: colors.background }]}>
        <View style={styles.searchInputWrapper}>
          <InputBox
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('home.myGroups.searchPlaceholder')}
            rightIcon={searchIcon}
            containerStyle={styles.searchInputContainer}
            inputWrapperStyle={{ borderRadius: 12 }}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}
          activeOpacity={0.7}
          onPress={handleFilterPress}
        >
          <Image
            source={APP_IMAGES.groupFilter}
            style={[styles.filterIcon, { tintColor: colors.iconPrimary }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {hasNoSearchResults && (
        <EmptyState
          title={t('home.myGroups.emptySearchResults')}
          style={styles.emptyStateContainer}
        />
      )}

      {!hasNoSearchResults && (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={postKeyExtractor}
          style={styles.postsList}
          contentContainerStyle={
            filteredPosts.length === 0
              ? styles.postsContentEmpty
              : styles.postsContent
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
          ListEmptyComponent={renderEmptyPosts}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: 22,
    height: 22,
  },
  groupsSection: {
    paddingVertical: 12,
  },
  groupsListContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  groupItem: {
    alignItems: 'center',
    width: 100,
    height: 125
  },
  groupImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  groupName: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
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

export default memo(MyGroupsTabContent);
