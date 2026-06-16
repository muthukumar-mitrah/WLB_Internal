import React, { memo, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import AppText from '../common/AppText';
import AppImage from '../common/AppImage';
import { APP_IMAGES, ROUTES } from '../../constants';
import { useProfile } from '../../context/ProfileContext';

const PostCard = ({
  userId,
  authorName,
  authorAvatar,
  currentWeight,
  timeAgo,
  content,
  image,
  likesCount,
  commentsCount,
  sharesCount,
  onPressComment,
  onPressShare,
  onPressOptions,
}) => {
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles({ colors, spacing }), [colors, spacing]);
  const navigation = useNavigation();

  // Local state for Like
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount || 0);

  const handlePressLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLocalLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLocalLikesCount(prev => prev + 1);
    }
  };

  const handlePressImage = () => {
    if (image) {
      navigation.navigate(ROUTES.IMAGE_PREVIEW, { imageUri: image });
    }
  };

  const { profile } = useProfile();
  const currentUserId = profile?.id;

  const handleProfilePress = useCallback(() => {
    // if (!userId) return;
    // if (userId === currentUserId) {
    //   navigation.navigate(ROUTES.MY_PROFILE);
    // } else {
    // }
    navigation.navigate(ROUTES.VIEW_PROFILE, { userId });
  }, [userId, navigation]);

  return (
    <>
      <View style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.authorRow}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <AppImage
              source={authorAvatar}
              style={styles.avatar}
              imageStyle={styles.fullSize}
              borderRadius={20}
            />
            <View style={styles.authorInfo}>
              <AppText variant="subtitleMedium" color={colors.textPrimary}>
                {authorName}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {currentWeight ? `CW: ${currentWeight} · ` : ''}{timeAgo}
              </AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onPressOptions}
            style={styles.optionsBtn}
          >
            <AppImage 
              source={APP_IMAGES.optionsIcon} 
              style={styles.headerIcon} 
              imageStyle={[styles.fullSize, { tintColor: colors.textSecondary }]} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {content ? (
            <AppText variant="body" color={colors.textPrimary} style={styles.contentText}>
              {content}
            </AppText>
          ) : null}
          {image ? (
            <TouchableOpacity activeOpacity={0.8} onPress={handlePressImage}>
              <AppImage
                source={image}
                style={styles.postImage}
                imageStyle={styles.fullSize}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Footer (Actions) */}
        <View style={styles.footer}>
          <View style={styles.actionsLeft}>
            <TouchableOpacity style={styles.actionBtn} onPress={handlePressLike}>
              <AppImage 
                source={APP_IMAGES.likeIcon} 
                style={styles.actionIcon}
                imageStyle={[styles.fullSize, { tintColor: isLiked ? colors.primary : colors.textSecondary }]} 
                resizeMode="contain"
              />
              <AppText variant="captionMedium" color={colors.textSecondary} style={styles.actionText}>
                {localLikesCount}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onPressComment}>
              <AppImage 
                source={APP_IMAGES.commentIcon} 
                style={styles.actionIcon}
                imageStyle={[styles.fullSize, { tintColor: colors.textSecondary }]} 
                resizeMode="contain"
              />
              <AppText variant="captionMedium" color={colors.textSecondary} style={styles.actionText}>
                {commentsCount}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onPressShare}>
              <AppImage 
                source={APP_IMAGES.shareIcon} 
                style={styles.actionIcon}
                imageStyle={[styles.fullSize, { tintColor: colors.textSecondary }]} 
                resizeMode="contain"
              />
              <AppText variant="captionMedium" color={colors.textSecondary} style={styles.actionText}>
                {sharesCount}
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsRight}>
            <AppImage
              source={authorAvatar}
              style={styles.smallBuddyAvatar}
              imageStyle={styles.fullSize}
              borderRadius={10}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: colors.background,
      width: '100%',
      paddingVertical: spacing[3],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      marginBottom: spacing[2],
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      marginRight: spacing[3],
    },
    fullSize: {
      width: '100%',
      height: '100%',
    },
    headerIcon: {
      width: 20,
      height: 20,
    },
    actionIcon: {
      width: 22,
      height: 22,
    },
    authorInfo: {
      justifyContent: 'center',
    },
    optionsBtn: {
      padding: spacing[1],
    },
    contentContainer: {
      marginTop: spacing[1],
    },
    contentText: {
      paddingHorizontal: spacing[4],
      marginBottom: spacing[3],
      lineHeight: 20,
    },
    postImage: {
      width: '100%',
      height: 300, // or aspect ratio based
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      marginTop: spacing[3],
    },
    actionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing[4],
    },
    actionText: {
      marginLeft: 6,
    },
    actionsRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    smallBuddyAvatar: {
      width: 20,
      height: 20,
    },
  });

export default memo(PostCard);
