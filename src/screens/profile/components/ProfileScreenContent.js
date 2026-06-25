/**
 * ProfileScreenContent — shared rendering logic for My Profile & View Profile.
 *
 * Accepts an `isOwnProfile` boolean to conditionally show:
 *  - Own profile: Update Profile + View Portrait buttons, Weight Progress card,
 *                 camera badge on avatar, MediaPicker modal
 *  - Other profile: Request Buddy + Message buttons, 3-dot menu, Block/Report modals
 */
import React, { memo, useCallback, useMemo, useState, useRef } from 'react';
import { View, StatusBar, TouchableOpacity, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import { DrawerActions } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  AppImage,
  Header,
  SafeContainer,
  ProgressBar,
  AppModal,
  ToastService,
  AppFlatList,
  CommentsBottomSheet,
  LikesBottomSheet,
  EmptyState,
  PostOptionsSheet,
  PostPreviewModal,
} from '../../../components/common';
import PostCard from '../../home/Feed';
import MediaPicker from '../../../components/common/MediaPicker';
import { ROUTES } from '../../../constants';
import { APP_IMAGES } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { useFeed } from '../../../context/FeedContext';

import { calculateWeightProgress } from '../../../utils/weightUtils';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileTabs from './ProfileTabs';
import WeightColumn from './WeightColumn';
import createStyles from './ProfileScreenContentStyles';

const ProfileScreenContent = ({
  navigation,
  isOwnProfile,
  isAIBuddy,       // true for AI Buddy profiles
  profile,
  avatar,          // uri string (own profile only)
  onAvatarChange,  // (uri) => void  (own profile only)
  headerTitle,     // optional custom title
  isShowHeader = true
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors, spacing, borderRadius, shadows, isDark } = theme;
  const { likePost, savePost } = useFeed();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark],
  );

  const commentsSheetRef = useRef(null);
  const likesSheetRef = useRef(null);

  // ── Own-profile modal state ─────────────────────────────────────────────────
  const [isEditVisible, setIsEditVisible] = useState(false);

  // ── Other-profile modal state ───────────────────────────────────────────────
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isBlockConfirmVisible, setIsBlockConfirmVisible] = useState(false);

  // ── Post Menu & Preview state ───────────────────────────────────────────────
  const [menuPost, setMenuPost] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ── Weight progress (own profile) ───────────────────────────────────────────
  const startWeight = profile?.startWeight ?? 150;
  const currentWeight = profile?.currentWeight ?? 144;
  const goalWeight = profile?.goalWeight ?? 140;
  const progressPercent = calculateWeightProgress(startWeight, currentWeight, goalWeight);

  // ── Tabs & Feed State ───────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('Posts');
  const [localPostUpdates, setLocalPostUpdates] = useState({});

  const feedData = useMemo(() => {
    return profile.posts?.map(post => {
      const resolvedAvatar = avatar
        ? { uri: avatar }
        : (post.authorAvatar ?? APP_IMAGES.userAvatar);

      const localUpdate = localPostUpdates[post.id];
      const liked = localUpdate?.liked !== undefined ? localUpdate.liked : (post.liked ?? false);
      const likesCount = localUpdate?.likes !== undefined ? localUpdate.likes : (post.likesCount ?? 0);
      const saved = localUpdate?.saved !== undefined ? localUpdate.saved : (post.saved ?? false);

      return {
        // identity
        id: post.id,
        userId: profile?.id,
        // Feed PostCard shape
        username: profile?.name ?? post.authorName,
        avatar: resolvedAvatar,
        currentWeight: isOwnProfile ? `${currentWeight}lbs` : (post.currentWeight ?? ''),
        timeAgo: post.timeAgo,
        text: post.content,
        image: post.image ?? null,
        video: post.video ?? null,
        likes: likesCount,
        comments: post.commentsCount ?? 0,
        shares: post.sharesCount ?? 0,
        saved: saved,
        liked: liked,
      };
    }) || [];
  }, [profile.posts, profile?.id, profile?.name, avatar, isOwnProfile, currentWeight, localPostUpdates]);

  const listData = useMemo(() => {
    const base = [
      { id: 'profile-header', type: 'header' },
      { id: 'profile-tabs', type: 'tabs' }
    ];

    if (activeTab === 'Posts' || activeTab === 'All') {
      return [
        ...base,
        ...feedData.map(post => ({ id: post.id, type: 'post', data: post }))
      ];
    } else {
      return [...base, { id: `empty-${activeTab}`, type: 'blank' }];
    }
  }, [feedData, activeTab]);

  // ── Avatar source ───────────────────────────────────────────────────────────
  const avatarSource = useMemo(
    () => avatar ? { uri: avatar } : APP_IMAGES.userAvatar,
    [avatar],
  );

  // ── Profile navigation helpers ───────────────────────────────────────────────
  const handleAvatarPress = useCallback((userId) => {
    if (!userId) return;
    navigation.navigate(ROUTES.VIEW_PROFILE, { userId });
  }, [navigation]);

  const handleImagePreview = useCallback((imageSource) => {
    setPreviewImage(imageSource);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const handleMenuPress = useCallback((post) => {
    setMenuPost(post);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuPost(null);
  }, []);

  const handleMenuSelect = useCallback((action) => {
    console.log('[ProfileScreen] Post action:', action, 'on post:', menuPost?.id);
  }, [menuPost]);

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

  const handleLikePress = useCallback((postId) => {
    likePost(postId); // backend call from useFeed

    setLocalPostUpdates(prev => {
      const prevUpdate = prev[postId] || {};
      const basePost = profile.posts?.find(p => p.id === postId) || {};
      const wasLiked = prevUpdate.liked !== undefined ? prevUpdate.liked : (basePost.liked ?? false);
      const baseLikes = prevUpdate.likes !== undefined ? prevUpdate.likes : (basePost.likesCount ?? 0);

      const nextLiked = !wasLiked;
      const nextLikes = nextLiked ? baseLikes + 1 : Math.max(0, baseLikes - 1);

      return {
        ...prev,
        [postId]: {
          ...prevUpdate,
          liked: nextLiked,
          likes: nextLikes,
        }
      };
    });
  }, [likePost, profile.posts]);

  const handleSavePress = useCallback((postId) => {
    savePost(postId);

    setLocalPostUpdates(prev => {
      const prevUpdate = prev[postId] || {};
      const basePost = profile.posts?.find(p => p.id === postId) || {};
      const wasSaved = prevUpdate.saved !== undefined ? prevUpdate.saved : (basePost.saved ?? false);

      return {
        ...prev,
        [postId]: {
          ...prevUpdate,
          saved: !wasSaved,
        }
      };
    });
  }, [savePost, profile.posts]);

  // ── Own-profile handlers ────────────────────────────────────────────────────
  const handleUpdateProfile = useCallback(() => {
    navigation.navigate(ROUTES.UPDATE_PROFILE);
  }, [navigation]);

  const handleOpenDrawer = useCallback(() => {
    const parent = navigation.getParent('RightDrawer');
    if (parent) {
      parent.dispatch(DrawerActions.openDrawer());
    } else {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }, [navigation]);

  const handleViewPortrait = useCallback(() => {
    navigation.navigate(ROUTES.PORTRAIT_VIEW, { imageUri: avatarSource });
  }, [navigation, avatarSource]);

  const handlePressAvatar = useCallback(() => {
    handleImagePreview(avatarSource);
  }, [handleImagePreview, avatarSource]);

  const handlePressCamera = useCallback(() => {
    setIsEditVisible(true);
  }, []);

  const handleImagePickerResponse = useCallback((response) => {
    if (!response) return;
    if (response.success && onAvatarChange) {
      onAvatarChange(response.asset.uri);
    }
    setIsEditVisible(false);
  }, [onAvatarChange]);

  // ── Other-profile handlers ──────────────────────────────────────────────────
  const handleRequestBuddy = useCallback(() => {
    ToastService.show({ type: 'success', message: t('profile.toast.requestSent') });
  }, [t]);

  const handleMessage = useCallback(() => {
    ToastService.show({ type: 'info', message: t('profile.toast.openingChat') });
  }, [t]);

  const handleChooseBuddy = useCallback(() => {
    ToastService.show({ type: 'success', message: t('aiBuddy.toast.chooseSuccess', 'AI Buddy selected successfully') });
  }, [t]);

  const handleFollow = useCallback(() => {
    ToastService.show({ type: 'success', message: t('aiBuddy.toast.followSuccess', 'Following AI Buddy') });
  }, [t]);

  const handleOpenMenu = useCallback(() => setIsMenuVisible(true), []);
  const handleCloseMenu = useCallback(() => setIsMenuVisible(false), []);

  const handleBlockPress = useCallback(() => {
    setIsMenuVisible(false);
    setTimeout(() => setIsBlockConfirmVisible(true), 300);
  }, []);

  const handleReportPress = useCallback(() => {
    setIsMenuVisible(false);
    setTimeout(() => navigation.navigate(ROUTES.REPORT_USER), 300);
  }, [navigation]);

  const handleConfirmBlock = useCallback(() => {
    setIsBlockConfirmVisible(false);
    ToastService.show({ type: 'success', message: t('profile.toast.blocked') });
  }, [t]);

  const handleCancelBlock = useCallback(() => setIsBlockConfirmVisible(false), []);

  const handleCopyLinkPress = useCallback(() => {
    const url = `https://weightlossbuddy.app/u/${profile?.name?.toLowerCase()}`;
    if (Clipboard?.setString) { Clipboard.setString(url); }
    ToastService.show({ type: 'success', message: t('profile.toast.copied') });
    setIsMenuVisible(false);
  }, [profile?.name, t]);

  // ── Right-header component ──────────────────────────────────────────────────
  const renderRightComponent = useMemo(() => {
    if (isOwnProfile) {
      return (
        <TouchableOpacity
          style={styles.menuButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={handleOpenDrawer}
          accessibilityLabel="Open Menu"
          accessibilityRole="button">
          <Icon name="menu" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      );
    }

    if (isAIBuddy) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.menuButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={handleOpenMenu}
        accessibilityLabel="Menu"
        accessibilityRole="button">
        <Icon name="dots-vertical" size={20} color={colors.textPrimary} />
      </TouchableOpacity>
    );
  }, [isOwnProfile, isAIBuddy, styles.menuButton, colors.textPrimary, handleOpenMenu, handleOpenDrawer]);

  // ── Action buttons (inside ProfileInfoCard) ─────────────────────────────────
  const renderActionButtons = useMemo(() => {
    if (isOwnProfile) {
      return (
        <View style={styles.buttonsRow}>
          <Button
            testID="profile-update-btn"
            title={t('profile.buttons.updateProfile')}
            onPress={handleUpdateProfile}
            variant="primary"
            size="md"
            fullWidth
            style={styles.flex1}
            accessibilityLabel={t('profile.buttons.updateProfile')}
          />
          <Button
            testID="profile-portrait-btn"
            title={t('profile.buttons.viewPortrait')}
            onPress={handleViewPortrait}
            variant="gray"
            size="md"
            fullWidth
            style={styles.secondaryButton}
            textStyle={{ color: colors.textPrimary }}
            accessibilityLabel={t('profile.buttons.viewPortrait')}
          />
        </View>
      );
    }

    if (isAIBuddy) {
      return (
        <View style={styles.buttonsRow}>
          <Button
            testID="profile-choose-buddy-btn"
            title={t('aiBuddy.details.chooseButton')}
            onPress={handleChooseBuddy}
            variant="primary"
            fullWidth
            style={styles.primaryButton}
            accessibilityLabel="Choose as AI Buddy"
          />
          <Button
            testID="profile-follow-btn"
            title={t('aiBuddy.details.followButton')}
            onPress={handleFollow}
            variant="gray"
            fullWidth
            style={styles.secondaryButton}
            textStyle={{ color: colors.textPrimary }}
            accessibilityLabel="Follow AI Buddy"
          />
        </View>
      );
    }

    return (
      <View style={styles.buttonsRow}>
        <Button
          testID="profile-request-buddy-btn"
          title={t('profile.buttons.requestBuddy')}
          onPress={handleRequestBuddy}
          variant="primary"
          size="md"
          fullWidth
          style={styles.buttonHalf}
          accessibilityLabel={t('profile.buttons.requestBuddy')}
        />
        <Button
          testID="profile-message-btn"
          title={t('profile.buttons.message')}
          onPress={handleMessage}
          variant="gray"
          size="md"
          fullWidth
          style={styles.secondaryButton}
          textStyle={{ color: colors.textPrimary }}
          accessibilityLabel={t('profile.buttons.message')}
        />
      </View>
    );
  }, [
    isOwnProfile, isAIBuddy, styles, colors, t,
    handleUpdateProfile, handleViewPortrait,
    handleChooseBuddy, handleFollow,
    handleRequestBuddy, handleMessage,
  ]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      {isShowHeader && (
        <>
          <StatusBar
            barStyle={colors.statusBar}
            backgroundColor={colors.primarySurface}
            translucent={false}
          />

          <Header
            title={headerTitle || t('profile.header.title')}
            showBack
            transparent={true}
            rightComponent={renderRightComponent}
          />
        </>
      )}

      <AppFlatList
        data={listData}
        keyExtractor={item => item.id}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View>
                <ProfileInfoCard
                  profile={profile}
                  isOwnProfile={isOwnProfile}
                  isAIBuddy={isAIBuddy}
                  avatarSource={avatarSource}
                  onPressCamera={isOwnProfile ? handlePressCamera : undefined}
                  onPressAvatar={handlePressAvatar}>
                  {renderActionButtons}
                </ProfileInfoCard>

                {isOwnProfile && (
                  <View style={styles.weightCard}>
                    <AppText variant="title" color={colors.textPrimary} style={styles.weightTitle}>
                      {t('profile.weightProgress.title')}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary} style={styles.weightSubtitle}>
                      {t('profile.weightProgress.subtitle')}
                    </AppText>

                    <View style={styles.weightRow}>
                      <WeightColumn
                        dotColor={colors.textTertiary}
                        label={t('profile.weightProgress.start')}
                        value={String(startWeight)}
                        iconName="fire"
                      />
                      <WeightColumn
                        dotColor={colors.primary}
                        label={t('profile.weightProgress.current')}
                        value={String(currentWeight)}
                        iconName="trending-down"
                      />
                      <WeightColumn
                        dotColor={colors.success}
                        label={t('profile.weightProgress.goal')}
                        value={String(goalWeight)}
                        iconName="target"
                      />
                    </View>

                    <View style={styles.progressHeader}>
                      <AppText variant="captionMedium" color={colors.textSecondary}>
                        {t('profile.weightProgress.progressLabel')}
                      </AppText>
                      <AppText
                        variant="label"
                        color={progressPercent >= 100 ? colors.success : colors.primary}>
                        {Math.round(progressPercent)}%
                      </AppText>
                    </View>
                    <ProgressBar
                      progress={progressPercent}
                      height={10}
                      color={colors.primary}
                      trackColor={colors.backgroundSecondary}
                      animated={true}
                    />
                  </View>
                )}
              </View>
            );
          }

          if (item.type === 'tabs') {
            return (
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            );
          }

          if (item.type === 'blank') {
            return (
              <View style={{ flex: 1, paddingVertical: spacing[10] }}>
                <EmptyState
                  title={t('common.noRecordsFound', 'No records found')}
                  icon={null}
                />
              </View>
            );
          }

          if (item.type === 'post') {
            return (
              <PostCard
                post={item.data}
                colors={colors}
                hidePostMenu={isOwnProfile}
                onLikePress={handleLikePress}
                onCommentPress={() => handleCommentPress(item.data)}
                onSharePress={() => handleSharePress(item.data)}
                onMenuPress={() => handleMenuPress(item.data)}
                onSavePress={handleSavePress}
                onAvatarPress={() => handleAvatarPress(item.data.userId)}
                onImagePreview={handleImagePreview}
                onLikesCountPress={() => handleLikesCountPress(item.data)}
              />
            );
          }

          return null;
        }}
      />

      {/* ── Own Profile: Media Picker Modal ── */}
      {isOwnProfile && (
        <AppModal
          visible={isEditVisible}
          onClose={() => setIsEditVisible(false)}
          showHandle={true}
          showCloseButton={false}>
          <MediaPicker
            onSelect={handleImagePickerResponse}
            closeModal={() => setIsEditVisible(false)}
            title={t('modals.uploadProfilePhoto.title')}
          />
        </AppModal>
      )}

      {/* ── Other Profile: 3-Dot Options Menu ── */}
      {!isOwnProfile && !isAIBuddy && (
        <>
          <AppModal
            visible={isMenuVisible}
            onClose={handleCloseMenu}
            showCloseButton={false}
            showHandle={true}
            position="bottom">
            <TouchableOpacity style={styles.menuItem} onPress={handleBlockPress}>
              <AppText style={styles.menuItemDangerText}>{t('profile.menu.block')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleReportPress}>
              <AppText style={styles.menuItemText}>{t('profile.menu.report')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleCopyLinkPress}>
              <AppText style={styles.menuItemText}>{t('profile.menu.copyLink')}</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSharePress}>
              <AppText style={styles.menuItemText}>{t('profile.menu.share')}</AppText>
            </TouchableOpacity>
          </AppModal>

          <AppModal
            visible={isBlockConfirmVisible}
            onClose={handleCancelBlock}
            showCloseButton={false}
            showHandle={true}
            position="bottom">
            <View style={styles.confirmContainer}>
              <AppImage
                source={APP_IMAGES.userAvatar}
                style={styles.confirmAvatar}
                imageStyle={styles.avatarImageInternal}
                borderRadius={36}
              />
              <AppText style={styles.confirmTitle}>
                {t('profile.block.title', { name: profile?.name })}
              </AppText>
              <AppText style={styles.confirmDescription}>
                {t('profile.block.description')}
              </AppText>
              <View style={styles.confirmButtonsRow}>
                <Button
                  title={t('profile.block.cancel')}
                  onPress={handleCancelBlock}
                  variant="gray"
                  fullWidth={false}
                  style={styles.confirmButton}
                />
                <Button
                  title={t('profile.block.block')}
                  onPress={handleConfirmBlock}
                  variant="primary"
                  fullWidth={false}
                  style={styles.confirmButton}
                />
              </View>
            </View>
          </AppModal>
        </>
      )}

      <CommentsBottomSheet
        ref={commentsSheetRef}
      />
      <LikesBottomSheet
        ref={likesSheetRef}
      />

      <PostOptionsSheet
        visible={!!menuPost}
        username={menuPost?.username}
        onClose={handleMenuClose}
        onSelect={handleMenuSelect}
      />

      <PostPreviewModal
        visible={!!previewImage}
        image={previewImage}
        onClose={handleClosePreview}
      />
    </SafeContainer>
  );
};

export default memo(ProfileScreenContent);
