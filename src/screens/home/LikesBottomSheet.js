import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback, memo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from '../../components/common/AppText';
import AppBottomSheet from '../../components/common/BottomSheet/AppBottomSheet';
import EmptyState from '../../components/common/EmptyState';
import { useTheme } from '../../theme';
import { fontFamily } from '../../theme/fonts';
import { t } from 'i18next';

// Mock likes database mapped by postId
const MOCK_LIKES = {
  '1': [
    { id: '1', username: 'alex_adams', name: 'Alex Adams', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isBuddy: true },
    { id: '2', username: 'jessica_r', name: 'Jessica Robinson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isBuddy: false },
    { id: '3', username: 'mike_t', name: 'Mike Thompson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isBuddy: false },
  ],
  '2': [
    { id: '2', username: 'jessica_r', name: 'Jessica Robinson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isBuddy: false },
    { id: '4', username: 'david_k', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isBuddy: true },
  ],
  '3': [], // Post 3 has no likes - will show empty state
};

// Fallback users list if postId doesn't exist in mock database
const DEFAULT_LIKES = [
  { id: '1', username: 'alex_adams', name: 'Alex Adams', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isBuddy: true },
  { id: '2', username: 'jessica_r', name: 'Jessica Robinson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isBuddy: false },
];

// Avatar Placeholder initials circle
const AvatarPlaceholder = memo(({ username, size = 38 }) => {
  const initials = (username || '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hue = username
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `hsl(${hue},55%,50%)`,
        },
      ]}
    >
      <AppText style={[styles.avatarText, { fontSize: size * 0.35 }]}>
        {initials}
      </AppText>
    </View>
  );
});

const LikesBottomSheet = forwardRef(({ onBuddyAction }, ref) => {
  const { colors, spacing } = useTheme();
  const sheetRef = useRef(null);

  // States
  const [sheetIndex, setSheetIndex] = useState(-1);
  const [postId, setPostId] = useState(null);
  const [buddiesState, setBuddiesState] = useState({}); // Track local follow/unfollow updates

  // Expose sheet control methods
  useImperativeHandle(ref, () => ({
    open: (selectedPostId) => {
      setPostId(selectedPostId);
      setSheetIndex(0);
      setTimeout(() => {
        sheetRef.current?.snapToIndex(0);
      }, 0);
    },
    close: () => {
      setSheetIndex(-1);
      sheetRef.current?.close();
    }
  }), []);

  // Track sheet state changes
  const handleSheetChange = useCallback((index) => {
    setSheetIndex(index);
    if (index === -1) {
      setPostId(null);
    }
  }, []);

  // Toggle Buddy (Follow/Unfollow) state helper
  const handleBuddyAction = useCallback((userId) => {
    setBuddiesState(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    onBuddyAction?.(userId);
  }, [onBuddyAction]);

  // Retrieve users who liked the current post
  const getLikedUsers = () => {
    if (!postId) return [];
    if (MOCK_LIKES[postId] !== undefined) {
      return MOCK_LIKES[postId];
    }
    return DEFAULT_LIKES;
  };

  const likedUsers = getLikedUsers();

  const renderUserItem = useCallback(({ item }) => {
    // Determine Buddy status (use local overrides first, then fallback to database item state)
    const isBuddy = buddiesState[item.id] !== undefined ? buddiesState[item.id] : item.isBuddy;

    return (
      <View style={styles.userRow}>
        <View style={styles.userInfoCol}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <AvatarPlaceholder username={item.username} />
          )}
          <View style={styles.textContainer}>
            <AppText variant="titleSmall" style={[styles.username, { color: colors.textPrimary }]}>
              {item.username}
            </AppText>
            <AppText variant="caption" style={[styles.fullName, { color: colors.textSecondary }]}>
              {item.name}
            </AppText>
          </View>
        </View>

        {/* Action Button: Add Buddy / Message */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            {
              backgroundColor: isBuddy ? colors.backgroundTertiary : colors.primary,
              borderColor: isBuddy ? colors.border : 'transparent',
              borderWidth: isBuddy ? 1 : 0,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => handleBuddyAction(item.id)}
        >
          <AppText
            variant="label"
            style={[
              styles.actionLabel,
              { color: isBuddy ? colors.textPrimary : '#FFFFFF' },
            ]}
          >
            {isBuddy ? t('common.message') : t('common.follow')}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }, [colors, buddiesState, handleBuddyAction]);

  return (
    <AppBottomSheet
      ref={sheetRef}
      index={sheetIndex}
      snapPoints={['50%', '85%']}
      onChange={handleSheetChange}
    >
      {/* Title Header */}
      <View style={styles.header}>
        <AppText variant="titleLarge" style={[styles.title, { color: colors.textPrimary }]}>
          {t('common.likes')}
        </AppText>
      </View>

      {/* FlatList for liked users */}
      <BottomSheetFlatList
        data={likedUsers}
        keyExtractor={item => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={[styles.listContainer, { paddingBottom: spacing[10] }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<Icon name="heart-outline" size={48} color={colors.textSecondary} />}
            title="No Likes Yet"
            description="Be the first to show some love to this post!"
            style={styles.emptyState}
          />
        }
      />
    </AppBottomSheet>
  );
});

const styles = StyleSheet.create({
  header: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  userInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
  fullName: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    marginTop: 1,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },
  emptyState: {
    paddingVertical: 60,
  },
});

export default memo(LikesBottomSheet);
