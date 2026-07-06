/**
 * PostCard — single feed post card.
 */
import React, { memo, useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { AppText, LikeAnimationOverlay, Button } from '../../../components/common';
import { APP_IMAGES } from '../../../constants';
import createStyles from './styles';
import { useAppTour } from '../../../hooks/useAppTour';
import { TourGuideZone } from 'rn-tourguide';

const ICON_LIKE = require('../../../assets/icons/heart-outline.png');
const ICON_COMMENT = require('../../../assets/icons/chat-outline.png');
const ICON_SHARE = require('../../../assets/icons/send-outline.png');
const ICON_ROBI = require('../../../assets/icons/robi.png');

const DOUBLE_TAP_DELAY = 300;

const FEED_TOUR_MASK_OFFSET = 8;
const FEED_TOUR_TOOLTIP_OFFSET = 75;

const HASHTAG_REGEX = /(#[a-zA-Z0-9_]+)/g;

const PostContent = memo(({ text, hashtagColor, textColor, style }) => {
  if (!text) return null;

  const parts = text.split(HASHTAG_REGEX);

  return (
    <AppText style={[style, { color: textColor }]}>
      {parts.map((part, index) =>
        part.startsWith('#') ? (
          <Text key={index} style={{ color: hashtagColor }}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </AppText>
  );
});

const AvatarPlaceholder = memo(({ username, size, colors, style }) => {
  const initials = (username || '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hue =
    (username || '')
      .split('')
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: `hsl(${hue},55%,50%)`,
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const textStyle = {
    color: colors.white,
    fontSize: size * 0.35,
    fontWeight: 'bold',
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {initials}
      </Text>
    </View>
  );
});

const PostCard = memo(
  ({
    post,
    isFirstPost = false,
    showChat,
    onLikePress,
    onSavePress,
    onMenuPress,
    onImagePreview,
    onCommentPress,
    onSharePress,
    onLikesCountPress,
    onAvatarPress,
    showApprovalActions,
    onApprove,
    onDecline,
  }) => {
    const { colors, spacing, borderRadius } = useTheme();
    const { t } = useTranslation();
    const { steps } = useAppTour();

    const stepMap = useMemo(() => {
      const map = {};
      if (steps) {
        steps.forEach((s) => {
          map[s.target] = s;
        });
      }
      return map;
    }, [steps]);

    const styles = useMemo(
      () => createStyles({ colors, spacing, borderRadius }),
      [colors, spacing, borderRadius],
    );

    const liked = post.liked ?? false;
    const [animationTrigger, setAnimationTrigger] = useState(0);

    const [aspectRatio, setAspectRatio] = useState(() => {
      if (post.image && typeof post.image === 'number') {
        try {
          const src = Image.resolveAssetSource(post.image);
          if (src?.width && src?.height) return src.width / src.height;
        } catch {
          // ignore
        }
      }
      return 16 / 9;
    });

    useEffect(() => {
      if (!post.image) return;
      if (typeof post.image === 'string') {
        Image.getSize(post.image, (w, h) => {
          if (w && h) setAspectRatio(w / h);
        });
      } else if (typeof post.image === 'object' && post.image.uri) {
        Image.getSize(post.image.uri, (w, h) => {
          if (w && h) setAspectRatio(w / h);
        });
      } else if (typeof post.image === 'number') {
        try {
          const src = Image.resolveAssetSource(post.image);
          if (src?.width && src?.height) setAspectRatio(src.width / src.height);
        } catch {
          // ignore
        }
      }
    }, [post.image]);

    const lastTap = useRef(0);
    const tapTimeout = useRef(null);

    useEffect(
      () => () => {
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
      },
      [],
    );

    const triggerLikeAnimation = useCallback(() => {
      setAnimationTrigger(prev => prev + 1);
    }, []);

    const handleLike = useCallback(
      isDoubleTap => {
        if (isDoubleTap) {
          if (!liked) onLikePress?.(post.id);
          triggerLikeAnimation();
        } else {
          onLikePress?.(post.id);
          if (!liked) triggerLikeAnimation();
        }
      },
      [liked, post.id, onLikePress, triggerLikeAnimation],
    );

    const handleMediaPress = useCallback(() => {
      const now = Date.now();
      if (now - lastTap.current < DOUBLE_TAP_DELAY) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
        handleLike(true);
      } else {
        lastTap.current = now;
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
        tapTimeout.current = setTimeout(() => {
          if (onImagePreview && post.image) onImagePreview(post.image);
          tapTimeout.current = null;
        }, DOUBLE_TAP_DELAY);
      }
    }, [handleLike, onImagePreview, post.image]);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            activeOpacity={0.7}
            onPress={() => onAvatarPress?.(post.id)}>
            <View style={styles.avatarContainer}>
              {post.avatar ? (
                <Image
                  source={
                    typeof post.avatar === 'number' || (typeof post.avatar === 'object' && post.avatar.test)
                      ? post.avatar
                      : typeof post.avatar === 'string'
                        ? { uri: post.avatar }
                        : post.avatar
                  }
                  style={styles.avatar}
                />
              ) : (
                <AvatarPlaceholder
                  username={post.username}
                  size={38}
                  colors={colors}
                  style={{ marginRight: 0 }}
                />
              )}
              {post.isOnline && (
                <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
              )}
            </View>
            <View style={styles.cardHeaderInfo}>
              <AppText style={[styles.cardUsername, { color: colors.textPrimary }]}>
                {post.username}
              </AppText>
              <AppText style={[styles.cardMeta, { color: colors.textSecondary }]}>
                {post.currentWeight ? `${t('home.feed.cw')}${post.currentWeight} · ` : ''}
                {post.timeAgo}
              </AppText>
            </View>
          </TouchableOpacity>
          <View style={styles.cardHeaderRight}>
            {showChat && (
              <TouchableOpacity style={styles.chatBtn} activeOpacity={0.8}>
                <AppText style={styles.chatBtnLabel}>
                  {t('home.feed.chat')}
                </AppText>
              </TouchableOpacity>
            )}
            {post.pinned && (
              <Image
                source={APP_IMAGES.pinFilled}
                style={styles.pinIcon}
              />
            )}
            <TouchableOpacity
              style={styles.menuBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => onMenuPress?.(post)}
              activeOpacity={0.6}>
              <Icon
                name="ellipsis-horizontal"
                size={20}
                color={colors.iconSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.postContentContainer}>
          <Pressable onPress={handleMediaPress} style={styles.textPressable}>
            {post.title && (
              <AppText style={[styles.cardTitle, { color: colors.textPrimary }]}>
                {post.title}
              </AppText>
            )}
            <PostContent
              text={post.text}
              textColor={colors.textPrimary}
              hashtagColor={colors.primary}
              style={styles.cardText}
            />
          </Pressable>
          {post.image && (
            <View style={styles.imageContainer}>
              <Pressable onPress={handleMediaPress} style={styles.imagePressable}>
                <Image
                  source={post.image}
                  style={[styles.postImage, { aspectRatio, height: undefined }]}
                  resizeMode="contain"
                />
              </Pressable>
              <LikeAnimationOverlay trigger={animationTrigger} />
            </View>
          )}
          {post.video && (
            <View style={styles.imageContainer}>
              <Pressable onPress={handleMediaPress} style={styles.imagePressable}>
                <Video
                  source={post.video}
                  style={styles.postImage}
                  resizeMode="cover"
                  paused
                  muted
                  repeat
                />
              </Pressable>
              <LikeAnimationOverlay trigger={animationTrigger} />
            </View>
          )}
          {!post.image && !post.video && (
            <LikeAnimationOverlay trigger={animationTrigger} />
          )}
        </View>
        {showApprovalActions ? (
          <View style={styles.approvalButtonsRow}>
            <Button
              title={t('groupDetails.postsApproval.decline')}
              variant="gray"
              size="sm"
              onPress={() => onDecline?.(post)}
              fullWidth={false}
              style={styles.approvalDeclineBtn}
            />
            <Button
              title={t('groupDetails.postsApproval.approve')}
              variant="primary"
              size="sm"
              onPress={() => onApprove?.(post)}
              fullWidth={false}
              style={styles.approvalApproveBtn}
            />
          </View>
        ) : (
          <View style={styles.reactionsRow}>
            <View style={styles.reactionBtn}>
              {isFirstPost && stepMap.likePost ? (
                <TourGuideZone
                  zone={stepMap.likePost.order}
                  shape="rectangle"
                  borderRadius={borderRadius.xl}
                  maskOffset={FEED_TOUR_MASK_OFFSET}
                  keepTooltipPosition={false}
                  tooltipBottomOffset={FEED_TOUR_TOOLTIP_OFFSET}
                  text={JSON.stringify({ title: t(stepMap.likePost.titleKey), body: t(stepMap.likePost.descKey) })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleLike(false)}>
                      <Image
                        source={ICON_LIKE}
                        style={[
                          styles.reactionIcon,
                          {
                            tintColor: liked
                              ? colors.error
                              : colors.iconSecondary,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => onLikesCountPress?.(post)}>
                      <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                        {post.likes}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </TourGuideZone>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleLike(false)}>
                    <Image
                      source={ICON_LIKE}
                      style={[
                        styles.reactionIcon,
                        {
                          tintColor: liked
                            ? colors.error
                            : colors.iconSecondary,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onLikesCountPress?.(post)}>
                    <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                      {post.likes}
                    </AppText>
                  </TouchableOpacity>
                </>
              )}
            </View>
            {isFirstPost && stepMap.comment ? (
              <TouchableOpacity
                style={styles.reactionBtn}
                activeOpacity={0.7}
                onPress={() => onCommentPress?.(post)}>
                <TourGuideZone
                  zone={stepMap.comment.order}
                  shape="rectangle"
                  borderRadius={borderRadius.xl}
                  maskOffset={FEED_TOUR_MASK_OFFSET}
                  keepTooltipPosition={true}
                  tooltipBottomOffset={FEED_TOUR_TOOLTIP_OFFSET}
                  text={JSON.stringify({ title: t(stepMap.comment.titleKey), body: t(stepMap.comment.descKey) })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                    <Image
                      source={ICON_COMMENT}
                      style={[styles.reactionIcon, { tintColor: colors.iconSecondary }]}
                    />
                    <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                      {post.comments}
                    </AppText>
                  </View>
                </TourGuideZone>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.reactionBtn}
                activeOpacity={0.7}
                onPress={() => onCommentPress?.(post)}>
                <Image
                  source={ICON_COMMENT}
                  style={[styles.reactionIcon, { tintColor: colors.iconSecondary }]}
                />
                <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                  {post.comments}
                </AppText>
              </TouchableOpacity>
            )}
            {isFirstPost && stepMap.sharePost ? (
              <TouchableOpacity
                style={styles.reactionBtn}
                activeOpacity={0.7}
                onPress={() => onSharePress?.(post)}>
                <TourGuideZone
                  zone={stepMap.sharePost.order}
                  shape="rectangle"
                  borderRadius={borderRadius.xl}
                  maskOffset={FEED_TOUR_MASK_OFFSET}
                  keepTooltipPosition={true}
                  tooltipBottomOffset={FEED_TOUR_TOOLTIP_OFFSET}
                  text={JSON.stringify({ title: t(stepMap.sharePost.titleKey), body: t(stepMap.sharePost.descKey) })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                    <Image
                      source={ICON_SHARE}
                      style={[styles.reactionIcon, { tintColor: colors.iconSecondary }]}
                    />
                    <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                      {post.shares}
                    </AppText>
                  </View>
                </TourGuideZone>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.reactionBtn}
                activeOpacity={0.7}
                onPress={() => onSharePress?.(post)}>
                <Image
                  source={ICON_SHARE}
                  style={[styles.reactionIcon, { tintColor: colors.iconSecondary }]}
                />
                <AppText style={[styles.reactionCount, { color: colors.textSecondary }]}>
                  {post.shares}
                </AppText>
              </TouchableOpacity>
            )}
            <View style={styles.spacer} />
            <TouchableOpacity
              style={[styles.reactionBtn, styles.robiContainer]}
              activeOpacity={0.7}
              onPress={() => onSavePress?.(post.id)}>
              {isFirstPost && stepMap.postBuddy ? (
                <TourGuideZone
                  zone={stepMap.postBuddy.order}
                  shape="rectangle"
                  borderRadius={borderRadius.xl}
                  maskOffset={FEED_TOUR_MASK_OFFSET}
                  keepTooltipPosition={true}
                  tooltipBottomOffset={FEED_TOUR_TOOLTIP_OFFSET}
                  text={JSON.stringify({ title: t(stepMap.postBuddy.titleKey), body: t(stepMap.postBuddy.descKey) })}
                >
                  <Image
                    source={ICON_ROBI}
                    style={styles.robiImage}
                  />
                </TourGuideZone>
              ) : (
                <Image
                  source={ICON_ROBI}
                  style={styles.robiImage}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

export default PostCard;