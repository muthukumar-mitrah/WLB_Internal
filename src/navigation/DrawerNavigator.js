/**
 * DrawerNavigator — Side drawer wrapping the BottomTabNavigator.
 *
 * Custom drawer content with user header, nav items, theme toggle, and logout.
 */
import React, { memo, useCallback, useMemo } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { AppText } from '../components/common';
import { useTranslation } from '../i18n/useTranslation';
import { ROUTES } from '../constants';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

// Drawer item configuration
const DRAWER_ITEMS = [
  { key: 'home', icon: 'home-outline', route: ROUTES.HOME },
  { key: 'profile', icon: 'person-outline', route: null },
  { key: 'settings', icon: 'settings-outline', route: null },
];

// Single drawer row
const DrawerItem = memo(({ icon, label, isActive, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      drawerItemStyles.row,
      isActive && { backgroundColor: colors.primarySurface },
    ]}>
    <Icon
      name={icon}
      size={22}
      color={isActive ? colors.primary : colors.textSecondary}
      style={drawerItemStyles.icon}
    />
    <AppText
      variant="bodyMedium"
      color={isActive ? colors.primary : colors.textPrimary}>
      {label}
    </AppText>
  </TouchableOpacity>
));

const drawerItemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 4,
  },
  icon: {
    marginRight: 14,
  },
});

// Custom drawer content
const CustomDrawerContent = memo((props) => {
  const { colors, isDark, toggleTheme, spacing } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createDrawerStyles({ colors, spacing }), [colors, spacing]);

  const currentRoute = props.state?.routes?.[props.state.index]?.name;

  const handleItemPress = useCallback((route) => {
    if(route) {
      props.navigation.navigate(route);
    }
    props.navigation.closeDrawer();
  }, [props.navigation]);

  const handleLogout = useCallback(() => {
    props.navigation.closeDrawer();
    // Logout logic will go here
  }, [props.navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* User header */}
      <View style={styles.userHeader}>
        <Image
          source={require('../assets/images/user.png')}
          style={styles.userAvatar}
          resizeMode="cover"
        />
        <View style={styles.userInfo}>
          <AppText variant="title" color={colors.textPrimary}>
            User
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            user@email.com
          </AppText>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Nav items */}
      <View style={styles.navSection}>
        {DRAWER_ITEMS.map(item => (
          <DrawerItem
            key={item.key}
            icon={item.icon}
            label={t(`drawer.${item.key}`)}
            isActive={currentRoute === item.route}
            onPress={() => handleItemPress(item.route)}
            colors={colors}
          />
        ))}
      </View>

      {/* Theme toggle */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.themeRow}>
        <Icon name="moon-outline" size={22} color={colors.textSecondary} style={{ marginRight: 14 }} />
        <AppText variant="bodyMedium" color={colors.textPrimary} style={{ flex: 1 }}>
          {t('drawer.theme')}
        </AppText>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Logout */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <TouchableOpacity onPress={handleLogout} activeOpacity={0.7} style={styles.logoutRow}>
        <Icon name="log-out-outline" size={22} color={colors.error} style={{ marginRight: 14 }} />
        <AppText variant="bodyMedium" color={colors.error}>
          {t('drawer.logout')}
        </AppText>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
});

const createDrawerStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    userHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[5],
      paddingTop: Platform.OS === 'android' ? spacing[5] : spacing[2],
    },
    userAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginRight: spacing[3],
    },
    userInfo: {
      flex: 1,
    },
    divider: {
      height: 1,
      marginHorizontal: spacing[4],
      marginVertical: spacing[2],
    },
    navSection: {
      marginTop: spacing[1],
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginHorizontal: 12,
    },
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginHorizontal: 12,
      marginBottom: spacing[5],
    },
  });

// Drawer navigator
const DrawerNavigator = () => {
  const { colors } = useTheme();

  const screenOptions = useMemo(() => ({
    headerShown: false,
    drawerType: 'front',
    drawerStyle: {
      backgroundColor: colors.background,
      width: 280,
    },
    overlayColor: colors.overlay,
    swipeEnabled: true,
  }), [colors]);

  return (
    <Drawer.Navigator
      screenOptions={screenOptions}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name={ROUTES.HOME_TABS} component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default memo(DrawerNavigator);
