import React, { memo, useCallback, useMemo, useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../theme';
import { useProfile } from '../../context/ProfileContext';
import {
  SafeContainer,
  Header,
  AppText,
  Divider,
  CommonToggle,
  ToastService,
  AppImage,
  AppModal,
} from '../../components/common';
import MediaPicker from '../../components/common/MediaPicker';
import createStyles from './styles';
import {
  PREFERENCES,
  APP_SETTINGS,
  ACCOUNT_ACTIONS,
} from '../../constants/accountSetting';

const AccountSettingScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, shadows, isDark } = useTheme();
  const { profile, updateProfileLocal, updateProfile } = useProfile();

  const [isEditVisible, setIsEditVisible] = useState(false);

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, shadows, isDark }),
    [colors, spacing, borderRadius, shadows, isDark]
  );

  const handlePressCamera = useCallback(() => {
    setIsEditVisible(true);
  }, []);

  const handleImagePickerResponse = useCallback(async (response) => {
    if (!response) return;
    if (response.success) {
      try {
        await updateProfile({ avatar: response.asset.uri });
        ToastService.show({
          type: 'success',
          message: t('profile.toast.avatarUpdated', 'Profile picture updated successfully.'),
        });
      } catch (error) {
        ToastService.show({
          type: 'error',
          message: t('profile.toast.avatarUpdateFailed', 'Failed to update profile picture.'),
        });
      }
    }
    setIsEditVisible(false);
  }, [updateProfile, t]);

  const toggleUnit = useCallback((unit) => {
    updateProfileLocal({ unit });
  }, [updateProfileLocal]);

  const toggleOnline = useCallback((val) => {
    updateProfileLocal({ onlineVisibility: val });
  }, [updateProfileLocal]);

  const updateSetting = useCallback((key, val) => {
    updateProfileLocal({ [key]: val });
  }, [updateProfileLocal]);

  const handleLogout = useCallback(() => { }, []);
  const handleDeleteAccount = useCallback(() => { }, []);

  const avatarSource = useMemo(() => {
    if (profile?.avatar) {
      return typeof profile.avatar === 'number' ? profile.avatar : { uri: profile.avatar };
    }
    return require('../../assets/images/user.png');
  }, [profile?.avatar]);

  // Section 1: Preferences
  const preferencesData = useMemo(() => {
    return PREFERENCES.map((item) => {
      if (item.id === 'unit') {
        return {
          ...item,
          value: profile?.unit || 'lbs',
          options: [
            { label: t('accountSettings.preferences.kg', 'Kg'), value: 'Kg' },
            { label: t('accountSettings.preferences.lbs', 'lbs'), value: 'lbs' }
          ],
          onChange: toggleUnit
        };
      }
      if (item.id === 'profileVisibility') {
        return {
          ...item,
          value: t(`accountSettings.preferences.${profile?.profileVisibility === 'Buddies only' ? 'buddiesOnly' : (profile?.profileVisibility?.toLowerCase() || 'public')}`, profile?.profileVisibility || 'Public'),
        };
      }
      if (item.id === 'weightVisibility') {
        return {
          ...item,
          value: t(`accountSettings.preferences.${profile?.weightVisibility === 'Buddies only' ? 'buddiesOnly' : profile?.weightVisibility === 'Only me' ? 'onlyMe' : (profile?.weightVisibility?.toLowerCase() || 'public')}`, profile?.weightVisibility || 'Public'),
        };
      }
      if (item.id === 'onlineVisibility') {
        return {
          ...item,
          value: profile?.onlineVisibility ?? true,
          options: [
            { label: t('accountSettings.preferences.off', 'Off'), value: false },
            { label: t('accountSettings.preferences.on', 'On'), value: true }
          ],
          onChange: toggleOnline
        };
      }
      return item;
    });
  }, [profile, t, toggleUnit, toggleOnline]);

  // Section 2: App Settings
  const appSettingsData = useMemo(() => {
    return APP_SETTINGS.map((item) => {
      return {
        ...item,
        value: profile?.[item.id] ?? true,
        onChange: (val) => updateSetting(item.id, val)
      };
    });
  }, [profile, updateSetting]);

  // Section 3: Account Actions
  const accountActionsData = useMemo(() => {
    return ACCOUNT_ACTIONS.map((item) => {
      return {
        ...item,
        onPress: item.id === 'logout' ? handleLogout : handleDeleteAccount
      };
    });
  }, [handleLogout, handleDeleteAccount]);

  const renderItem = useCallback((item, index, totalItems) => {
    const isLast = index === totalItems - 1;

    const content = (
      <>
        {/* Left icon wrapper */}
        <View style={[styles.prefIconContainer, item.isDestructive && styles.deleteIconContainer]}>
          <Image source={item.imageSource} style={styles.preferenceIconImage} />
        </View>

        {/* Text descriptions */}
        <View style={styles.appSettingTextContainer}>
          <AppText
            variant="body"
            color={item.isDestructive ? colors.error : colors.textPrimary}
            style={styles.appSettingTitle}
          >
            {t(item.titleKey)}
          </AppText>
          {item.subtitleKey && (
            <AppText
              variant="caption"
              color={item.isDestructive ? colors.error : colors.textTertiary}
              style={styles.appSettingDesc}
            >
              {t(item.subtitleKey)}
            </AppText>
          )}
        </View>

        {/* Right interaction based on type */}
        {item.type === 'switch' && (
          <CommonToggle
            value={item.value}
            onValueChange={item.onChange}
          />
        )}

        {item.type === 'segmented' && (
          <View style={styles.segmentedContainer}>
            {item.options.map((opt) => {
              const isActive = item.value === opt.value;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                  onPress={() => item.onChange(opt.value)}
                  activeOpacity={0.8}
                >
                  <AppText
                    variant="caption"
                    style={isActive ? styles.segmentTextActive : styles.segmentTextInactive}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {item.type === 'navigation' && (
          <View style={styles.prefRightContainer}>
            <AppText variant="caption" color={colors.textPrimary} style={styles.prefValueText}>
              {item.value}
            </AppText>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} style={styles.chevron} />
          </View>
        )}

        {item.type === 'action' && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        )}
      </>
    );

    // Dynamic row wrappers based on type
    if (item.type === 'navigation') {
      let rowStyle = styles.prefRow;
      if (totalItems === 4) {
        if (index === 0) {
          rowStyle = styles.prefRowCompactBottom;
        } else if (index === 1 || index === 2) {
          rowStyle = styles.prefRowCompactBoth;
        } else if (index === 3) {
          rowStyle = styles.prefRowCompactTop;
        }
      }

      return (
        <View key={item.id}>
          <TouchableOpacity
            style={rowStyle}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
          >
            {content}
          </TouchableOpacity>
          {!isLast && <Divider style={styles.divider} />}
        </View>
      );
    }

    if (item.type === 'action') {
      return (
        <TouchableOpacity
          key={item.id}
          style={item.isDestructive ? styles.deleteCard : styles.logoutRow}
          activeOpacity={0.8}
          onPress={item.onPress}
        >
          <View style={item.isDestructive ? styles.deleteRow : styles.prefRow}>
            {content}
          </View>
        </TouchableOpacity>
      );
    }

    let rowStyle;
    if (totalItems === 4) {
      if (index === 0) {
        rowStyle = styles.prefRowCompactBottom;
      } else if (index === 1 || index === 2) {
        rowStyle = styles.prefRowCompactBoth;
      } else if (index === 3) {
        rowStyle = styles.prefRowCompactTop;
      } else {
        rowStyle = styles.prefRow;
      }
    } else if (totalItems === 3) {
      if (index === 0) {
        rowStyle = styles.appSettingRowCompactBottom;
      } else if (index === 1) {
        rowStyle = styles.appSettingRowCompactBoth;
      } else if (index === 2) {
        rowStyle = styles.appSettingRowCompactTop;
      } else {
        rowStyle = styles.appSettingRow;
      }
    } else {
      rowStyle = item.type === 'switch' ? styles.appSettingRow : styles.prefRow;
    }

    return (
      <View key={item.id}>
        <View style={rowStyle}>
          {content}
        </View>
        {!isLast && <Divider style={styles.divider} />}
      </View>
    );
  }, [colors, t, navigation, styles]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={[styles.container, { backgroundColor: colors.backgroundTertiary }]}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Header title={t('accountSettings.title', 'Account Settings')} showBack titleAlign="left" transparent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePressCamera}
            activeOpacity={0.7}
            accessibilityLabel="Change profile photo"
            accessibilityRole="button"
          >
            <AppImage
              source={avatarSource}
              style={styles.avatar}
              imageStyle={styles.avatar}
              borderRadius={12}
              resizeMode="cover"
            />
            <View style={styles.cameraIcon}>
              <MCIcon name="camera-outline" size={15} color={colors.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <AppText variant="title" color={colors.textPrimary} style={styles.profileName}>
              {profile?.name || 'User'}
            </AppText>
            <View style={styles.profileEmailContainer}>
              <Ionicons name="mail-outline" size={16} color={colors.textPrimary} />
              <AppText variant="caption" color={colors.textPrimary} style={styles.profileEmail}>
                {profile?.email || 'user@email.com'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionHeaderRow}>
          <AppText variant="subtitleMedium" color={colors.textPrimary} style={styles.sectionTitle}>
            {t('accountSettings.sections.preferences', 'Preferences')}
          </AppText>
          <AppText variant="caption" color={isDark ? colors.textPrimary : colors.textTertiary} style={styles.sectionHeaderSubtitle}>
            {t('accountSettings.preferences.tapToChange', 'Tap to change')}
          </AppText>
        </View>
        <View style={styles.settingsCard}>
          {preferencesData.map((item, index) => renderItem(item, index, preferencesData.length))}
        </View>

        {/* App Settings Section */}
        <AppText variant="subtitleMedium" color={colors.textSecondary} style={styles.sectionTitleStandalone}>
          {t('accountSettings.sections.appSettings', 'App Settings')}
        </AppText>
        <View style={styles.settingsCard}>
          {appSettingsData.map((item, index) => renderItem(item, index, appSettingsData.length))}
        </View>

        {/* Account Actions Section */}
        <AppText variant="subtitleMedium" color={colors.textSecondary} style={styles.sectionTitleStandalone}>
          {t('accountSettings.sections.accountActions', 'Account Actions')}
        </AppText>
        {accountActionsData.map((item, index) => renderItem(item, index, accountActionsData.length))}
      </ScrollView>

      {/* Media Picker Modal */}
      <AppModal
        visible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
        showHandle={true}
        showCloseButton={false}
      >
        <MediaPicker
          onSelect={handleImagePickerResponse}
          closeModal={() => setIsEditVisible(false)}
          title={t('modals.uploadProfilePhoto.title', 'Upload Profile Photo')}
        />
      </AppModal>
    </SafeContainer>
  );
};

export default memo(AccountSettingScreen);
