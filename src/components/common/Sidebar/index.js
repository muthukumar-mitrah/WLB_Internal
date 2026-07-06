/**
 * Sidebar — custom drawer content.
 */
import React, { memo, useState, useCallback, useMemo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAuth } from '../../../context/AuthContext';
import { useFeed } from '../../../context/FeedContext';
import { useAppTour } from '../../../hooks/useAppTour';
import { openTour } from '../../../utils/navigationHelpers';
import { ROUTES } from '../../../constants';
import { ToastService } from '../Toast';
import AppText from '../AppText';
import AIBuddyIntroModal from '../AIBuddyIntroModal';
import createStyles, { ICON_SIZE } from './styles';

const ASSET = {
  blockedUsers: require('../../../assets/icons/blocked_user.png'),
  changePassword: require('../../../assets/icons/change_password.png'),
  blog: require('../../../assets/icons/blog.png'),
  tracker: require('../../../assets/icons/tracker.png'),
  savedPosts: require('../../../assets/icons/saved_post.png'),
  awards: require('../../../assets/icons/awards.png'),
  leaderBoard: require('../../../assets/icons/leader_board.png'),
  settingsSection: require('../../../assets/icons/settings.png'),
  supportSection: require('../../../assets/icons/support.png'),
  aiSettings: require('../../../assets/icons/ai_settings.png'),
  accountSettings: require('../../../assets/icons/account_settings.png'),
  help: require('../../../assets/icons/help.png'),
  contactUs: require('../../../assets/icons/contact_us.png'),
  terms: require('../../../assets/icons/terms.png'),
  privacyPolicy: require('../../../assets/icons/privacy_policy.png'),
  logout: require('../../../assets/icons/logout.png'),
  userPlaceholder: require('../../../assets/images/user.png'),
};

const MENU_GROUPS = [
  [
    { key: 'blockedUsers', asset: 'blockedUsers' },
    { key: 'changePassword', asset: 'changePassword' },
  ],
  [
    { key: 'blog', asset: 'blog' },
    { key: 'trackProgress', asset: 'tracker' },
  ],
  [
    { key: 'chooseAiBuddy', vectorIcon: 'people-outline' },
    { key: 'savedPosts', asset: 'savedPosts' },
    { key: 'awards', asset: 'awards' },
    { key: 'leaderBoard', asset: 'leaderBoard' },
    { key: 'help', asset: 'help' },
  ],
];

const SETTINGS_ITEMS = [
  { key: 'aiSettings', asset: 'aiSettings' },
  { key: 'accountSettings', asset: 'accountSettings' },
];

const SUPPORT_ITEMS = [
  { key: 'help', asset: 'help' },
  { key: 'contactUs', asset: 'contactUs' },
  { key: 'termsOfUse', asset: 'terms' },
  { key: 'privacyPolicy', asset: 'privacyPolicy' },
];

const ROUTE_MAP = {
  contactUs: ROUTES.CONTACT_US,
  termsOfUse: ROUTES.TERMS_OF_USE,
  privacyPolicy: ROUTES.PRIVACY_POLICY,
  chooseAiBuddy: ROUTES.CHOOSE_AI_BUDDY,
  aiSettings: ROUTES.AI_SETTINGS,
  blockedUsers: ROUTES.BLOCKED_USER,
  awards: ROUTES.AWARDS,
  leaderBoard: ROUTES.LEADER_BOARD,
  changePassword: ROUTES.SETTINGS_CHANGE_PASSWORD,
  accountSettings: ROUTES.ACCOUNT_SETTINGS,
  trackProgress: ROUTES.TRACK_PROGRESS,
};

const getGreetingKey = () => {
  const h = new Date().getHours();
  if (h < 12) return 'sidebar.greeting.morning';
  if (h < 17) return 'sidebar.greeting.afternoon';
  return 'sidebar.greeting.evening';
};

const MenuItem = memo(({ asset, vectorIcon, label, onPress, styles, colors }) => (
  <TouchableOpacity
    style={styles.menuItem}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.iconWrapper}>
      {vectorIcon ? (
        <Icon name={vectorIcon} size={ICON_SIZE} color={colors.textSecondary} />
      ) : (
        <Image
          source={ASSET[asset]}
          style={[styles.menuIcon, { tintColor: colors.textSecondary }]}
          resizeMode="contain"
        />
      )}
    </View>
    <AppText variant="body" color={colors.textPrimary}>
      {label}
    </AppText>
  </TouchableOpacity>
));

const SubMenuItem = memo(({ asset, label, onPress, styles, colors }) => (
  <TouchableOpacity
    style={styles.subMenuItem}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.subIconWrapper}>
      <Image
        source={ASSET[asset]}
        style={[styles.subMenuIcon, { tintColor: colors.textSecondary }]}
        resizeMode="contain"
      />
    </View>
    <AppText variant="body" color={colors.textPrimary}>
      {label}
    </AppText>
  </TouchableOpacity>
));

const SectionHeader = memo(({ asset, label, expanded, onPress, styles, colors }) => (
  <TouchableOpacity
    style={styles.sectionHeader}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.iconWrapper}>
      <Image
        source={ASSET[asset]}
        style={[styles.menuIcon, { tintColor: colors.textSecondary }]}
        resizeMode="contain"
      />
    </View>
    <AppText variant="body" color={colors.textPrimary} style={{ flex: 1 }}>
      {label}
    </AppText>
    <Icon
      name={expanded ? 'chevron-up' : 'chevron-down'}
      size={16}
      color={colors.textTertiary}
      style={styles.sectionChevron}
    />
  </TouchableOpacity>
));

const Sidebar = (props) => {
  const { navigation } = props;
  const { colors, spacing, borderRadius, isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);

  const user = { name: 'User', email: 'user@email.com', avatar: null };
  const { setActiveTab } = useFeed();
  const { setPendingTourStart } = useAppTour();

  const close = useCallback(() => navigation.closeDrawer(), [navigation]);

  const handleItemPress = useCallback(
    (key) => {
      if (key === 'help') {
        openTour(navigation, setActiveTab, setPendingTourStart);
        return;
      }

      navigation.closeDrawer();
      if (key === 'chooseAiBuddy') {
        setIntroVisible(true);
        return;
      }
      const route = ROUTE_MAP[key];

      if (route) {
        navigation.navigate(route);
      } else {
        ToastService.show({
          type: 'info',
          message: t('home.comingSoon'),
        });
      }
    },
    [navigation, t, setActiveTab, setPendingTourStart],
  );

  const handleLogout = useCallback(() => {
    navigation.closeDrawer();
    logout();
  }, [navigation, logout]);

  const greeting = t(getGreetingKey(), { name: user.name });

  const handleProfilePress = useCallback(() => {
    close();
    navigation.navigate(ROUTES.MY_PROFILE);
  }, [close, navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <AIBuddyIntroModal
        visible={introVisible}
        onClose={() => {
          setIntroVisible(false);
          navigation.closeDrawer();
        }}
        onNext={() => {
          setIntroVisible(false);
          navigation.closeDrawer();
          navigation.navigate(ROUTES.CHOOSE_AI_BUDDY);
        }}
      />
      <View style={styles.header}>
        <AppText
          variant="bodyMedium"
          color={colors.textPrimary}
          style={styles.greeting}
          numberOfLines={1}
        >
          {greeting}
        </AppText>
        <View style={styles.themeToggle}>
          <TouchableOpacity
            style={[styles.themeBtn, !isDark && styles.themeBtnActive]}
            activeOpacity={0.8}
            onPress={() => toggleTheme()}
          >
            <Icon
              name="sunny"
              size={15}
              color={!isDark ? colors.white : colors.textTertiary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeBtn, isDark && styles.themeBtnActive]}
            activeOpacity={0.8}
            onPress={() => toggleTheme()}
          >
            <Icon
              name="moon"
              size={14}
              color={isDark ? colors.white : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.profileRow}
        activeOpacity={0.8}
        onPress={handleProfilePress}
      >
        <Image
          source={user.avatar ? { uri: user.avatar } : ASSET.userPlaceholder}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.userInfo}>
          <AppText variant="titleMedium" color={colors.textPrimary}>
            {user.name}
          </AppText>
          <AppText
            variant="caption"
            color={colors.textSecondary}
            style={styles.userEmail}
          >
            {user.email}
          </AppText>
        </View>
        <Icon
          name="chevron-back"
          size={18}
          color={colors.textTertiary}
          style={styles.profileChevron}
        />
      </TouchableOpacity>
      {MENU_GROUPS.map((group, groupIndex) => (
        <View key={groupIndex}>
          {groupIndex > 0 && <View style={styles.divider} />}
          <View style={styles.menuSection}>
            {group.map((item) => (
              <MenuItem
                key={item.key}
                asset={item.asset}
                vectorIcon={item.vectorIcon}
                label={t(`sidebar.menu.${item.key}`)}
                onPress={() => handleItemPress(item.key)}
                styles={styles}
                colors={colors}
              />
            ))}
          </View>
        </View>
      ))}
      <View style={styles.spacer} />
      <SectionHeader
        asset="settingsSection"
        label={t('sidebar.sections.settings')}
        expanded={settingsOpen}
        onPress={() => setSettingsOpen((v) => !v)}
        styles={styles}
        colors={colors}
      />
      {settingsOpen && (
        <View style={styles.subMenuContainer}>
          {SETTINGS_ITEMS.map((item) => (
            <SubMenuItem
              key={item.key}
              asset={item.asset}
              label={t(`sidebar.settings.${item.key}`)}
              onPress={() => handleItemPress(item.key)}
              styles={styles}
              colors={colors}
            />
          ))}
        </View>
      )}
      <SectionHeader
        asset="supportSection"
        label={t('sidebar.sections.supportLegal')}
        expanded={supportOpen}
        onPress={() => setSupportOpen((v) => !v)}
        styles={styles}
        colors={colors}
      />
      {supportOpen && (
        <View style={styles.subMenuContainer}>
          {SUPPORT_ITEMS.map((item) => (
            <SubMenuItem
              key={item.key}
              asset={item.asset}
              label={t(`sidebar.support.${item.key}`)}
              onPress={() => handleItemPress(item.key)}
              styles={styles}
              colors={colors}
            />
          ))}
        </View>
      )}
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.logoutRow}
        activeOpacity={0.7}
        onPress={handleLogout}
      >
        <View style={styles.iconWrapper}>
          <Image
            source={ASSET.logout}
            style={[styles.logoutIcon, { tintColor: colors.error }]}
            resizeMode="contain"
          />
        </View>
        <AppText variant="bodyMedium" color={colors.error}>
          {t('sidebar.logout')}
        </AppText>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default memo(Sidebar);
