import React, {memo, useMemo} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {APP_IMAGES} from '../../../constants';
import {useTheme} from '../../../theme';
import {AppText, AppImage, Divider} from '../../../components/common';
import createStyles from './ProfileInfoCardStyles';
import {useTranslation} from 'react-i18next';

const StatItem = memo(({count, label, colors, styles}) => (
  <View style={styles.statItem}>
    <AppText variant="h3" color={colors.textPrimary} style={styles.statCount}>
      {count}
    </AppText>
    <AppText variant="caption" color={colors.textSecondary}>
      {label}
    </AppText>
  </View>
));

const InfoCardItem = memo(({imageSource, label, value, colors, styles, positionStyle}) => (
  <View style={[styles.infoCardSingle, positionStyle]}>
    <View style={styles.infoIconWrapper}>
      <Image
        source={imageSource}
        style={styles.infoIconImage}
        resizeMode="contain"
      />
    </View>
    <View style={styles.infoTextBlock}>
      <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
        {label}
      </AppText>
      <AppText variant="bodyMedium" color={colors.textPrimary} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  </View>
));

const ProfileInfoCard = ({profile, isOwnProfile, isAIBuddy, avatarSource, onPressCamera, onPressAvatar, children}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {colors, spacing, borderRadius, shadows, isDark} = theme;

  const styles = useMemo(
    () => createStyles({colors, spacing, borderRadius, shadows, isDark}),
    [colors, spacing, borderRadius, shadows, isDark],
  );

  return (
    <View style={styles.mainCard}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={onPressAvatar} activeOpacity={0.9}>
            <AppImage
              source={avatarSource || APP_IMAGES.userAvatar}
              style={styles.avatarImage}
              imageStyle={styles.avatarImageInternal}
              borderRadius={borderRadius.xl}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.cameraIconWrapper}
              onPress={onPressCamera}
              activeOpacity={0.7}
              accessibilityLabel="Change profile photo"
              accessibilityRole="button"
            >
              <Icon name="camera-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.avatarTextBlock}>
          <AppText variant="h3" color={colors.textPrimary} style={styles.userName}>
            {profile?.name}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} style={styles.userBio}>
            {profile?.bio}
          </AppText>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatItem count={profile.postCount} label={t('profile.infoCard.posts')} colors={colors} styles={styles} />
        <Divider orientation="vertical" color={colors.border} style={styles.statDivider} />
        <StatItem count={profile.followingCount} label={t('profile.infoCard.following')} colors={colors} styles={styles} />
        <Divider orientation="vertical" color={colors.border} style={styles.statDivider} />
        <StatItem count={profile.followersCount} label={t('profile.infoCard.followers')} colors={colors} styles={styles} />
        {!isAIBuddy && (
          <>
            <Divider orientation="vertical" color={colors.border} style={styles.statDivider} />
            <StatItem count={profile.buddiesCount} label={t('profile.infoCard.buddies')} colors={colors} styles={styles} />
          </>
        )}
      </View>

      {/* Info Grid */}
      {!isAIBuddy && (
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <InfoCardItem
              imageSource={APP_IMAGES.gender}
              label={t('profile.infoCard.labels.gender')}
              value={profile?.gender}
              colors={colors}
              styles={styles}
              positionStyle={styles.infoCardLeft}
            />
            <InfoCardItem
              imageSource={APP_IMAGES.country}
              label={t('profile.infoCard.labels.country')}
              value={profile?.country}
              colors={colors}
              styles={styles}
              positionStyle={styles.infoCardRight}
            />
          </View>

          <View style={styles.infoRow}>
            <InfoCardItem
              imageSource={APP_IMAGES.dateOfBirth}
              label={t('profile.infoCard.labels.dateOfBirth')}
              value={profile?.dateOfBirth}
              colors={colors}
              styles={styles}
              positionStyle={styles.infoCardLeft}
            />
            <InfoCardItem
              imageSource={APP_IMAGES.totalPoints}
              label={t('profile.infoCard.labels.totalPoints')}
              value={String(profile.totalPoints ?? 0)}
              colors={colors}
              styles={styles}
              positionStyle={styles.infoCardRight}
            />
          </View>

          <View style={styles.infoRow}>
            <InfoCardItem
              imageSource={APP_IMAGES.currentWeight}
              label={t('profile.infoCard.labels.currentWeight')}
              value={
                 typeof profile?.currentWeight === 'number'
                   ? `${profile.currentWeight} `
                   : String(profile?.currentWeight ?? '')
              }
              colors={colors}
              styles={styles}
              positionStyle={styles.infoCardLeft}
            />
            <InfoCardItem
              imageSource={APP_IMAGES.weeklyPoints}
              label={t('profile.infoCard.labels.weeklyPoints')}
              value={String(profile?.weeklyPoints ?? 0)}
              colors={colors}
              styles={styles}
              positionStyle={styles.infoCardRight}
            />
          </View>
        </View>
      )}

      {/* Action Buttons Row */}
      {children}
    </View>
  );
};

export default memo(ProfileInfoCard);
