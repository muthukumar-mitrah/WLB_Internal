/**
 * BottomTabNavigator — 5-tab bottom bar.
 *
 * Tabs: Home | Buddies | + (Create) | Notification | Robi
 * Center "+" button is a custom elevated circle.
 * Active/inactive icons use PNG assets from assets/icons.
 */
import React, { memo, useMemo } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n/useTranslation';
import { ROUTES } from '../constants';

import HomeScreen from '../screens/home/HomeScreen';
import BuddiesScreen from '../screens/home/BuddiesScreen';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import RobiScreen from '../screens/home/RobiScreen';

const Tab = createBottomTabNavigator();

// ─── Layout constants ─────────────────────────────────────────────────────────

/** Visible content height of the tab bar (above the safe-area inset). */
const TAB_BAR_HEIGHT = 60;

/** Fixed icon-container dimensions — ensures active & inactive icons occupy
 *  identical space so switching state never causes vertical shifting. */
const ICON_CONTAINER = 28;
const ICON_SIZE = 22;

/** Center "+" button dimensions & vertical lift. */
const CREATE_BUTTON_SIZE = 56;
const CREATE_BUTTON_LIFT = 16;

// ─── Icon assets ──────────────────────────────────────────────────────────────

const TAB_ICONS = {
  [ROUTES.HOME]: {
    active: require('../assets/icons/home_filled.png'),
    inactive: require('../assets/icons/home_outlined.png'),
  },
  [ROUTES.BUDDIES]: {
    active: require('../assets/icons/user_search_filled.png'),
    inactive: require('../assets/icons/user_search_outlined.png'),
  },
  [ROUTES.CREATE_POST]: {
    active: require('../assets/icons/add_post.png'),
    inactive: require('../assets/icons/add_post.png'),
  },
  [ROUTES.NOTIFICATIONS]: {
    active: require('../assets/icons/notification_filled.png'),
    inactive: require('../assets/icons/notification_outlined.png'),
  },
  [ROUTES.ROBI]: {
    active: require('../assets/icons/robi.png'),
    inactive: require('../assets/icons/robi.png'),
  },
};

// ─── No-ripple tab button ─────────────────────────────────────────────────────
//
// React Navigation's default PlatformPressable produces an Android ripple and
// an iOS opacity flash.  Replacing it with TouchableOpacity(activeOpacity=1)
// gives a completely neutral press — no ripple, no flash, no highlight.

// Must NOT be wrapped in memo() — React Navigation calls tabBarButton as a
// plain function (button(props)), not via React.createElement. A memo wrapper
// is an object, not a callable, which throws "Object is not a function".
const NoRippleTabButton = (props) => (
  <TouchableOpacity {...props} activeOpacity={1} />
);

// ─── Tab icon ─────────────────────────────────────────────────────────────────
//
// Wrapped in a fixed-size container so the layout space is identical whether
// the tab is focused or not.  Without the wrapper, different PNG intrinsic
// sizes can shift the label position on focus change.

const TabIcon = memo(({ routeName, focused, colors }) => {
  const icons = TAB_ICONS[routeName];
  if (!icons) return null;

  const isRobi = routeName === ROUTES.ROBI;
  const source = focused ? icons.active : icons.inactive;

  return (
    <View style={tabIconStyles.container}>
      <Image
        source={source}
        style={[
          tabIconStyles.icon,
          !isRobi && {
            tintColor: focused ? colors.tabBarActive : colors.tabBarInactive,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
});

const tabIconStyles = StyleSheet.create({
  container: {
    width: ICON_CONTAINER,
    height: ICON_CONTAINER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});

// ─── Center "+" create button ─────────────────────────────────────────────────

const CreateTabButton = memo(({ onPress, colors, shadows }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={createBtnStyles.container}
    accessibilityRole="button"
    accessibilityLabel="Create Post"
  >
    <View
      style={[
        createBtnStyles.circle,
        { backgroundColor: colors.primary },
        shadows.md,
      ]}
    >
      <Image
        source={TAB_ICONS[ROUTES.CREATE_POST].active}
        style={createBtnStyles.icon}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
));

const createBtnStyles = StyleSheet.create({
  container: {
    top: -CREATE_BUTTON_LIFT,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CREATE_BUTTON_SIZE,
    height: CREATE_BUTTON_SIZE,
    borderRadius: CREATE_BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: CREATE_BUTTON_SIZE,
    height: CREATE_BUTTON_SIZE,
    borderRadius: CREATE_BUTTON_SIZE / 2,
  },
});

// ─── Navigator ────────────────────────────────────────────────────────────────

const BottomTabNavigator = () => {
  const { colors, spacing, shadows } = useTheme();
  const { t } = useTranslation();

  // Use actual bottom safe-area inset so the bar sits correctly above the
  // system navigation area on every device and navigation mode:
  //   • Android gesture nav     → insets.bottom > 0
  //   • Android 3-button nav    → insets.bottom > 0
  //   • iPhone with home bar    → insets.bottom > 0
  //   • iPhone without home bar → insets.bottom = 0
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  const screenOptions = useMemo(
    () => ({
      headerShown: false,

      // Replace PlatformPressable (which has ripple) with a neutral
      // TouchableOpacity for all tabs.  CREATE_POST overrides this with its
      // own tabBarButton so the center circle is unaffected.
      tabBarButton: NoRippleTabButton,

      tabBarStyle: {
        backgroundColor: colors.tabBarBackground,
        // Setting an explicit height disables React Navigation's automatic
        // safe-area calculation, so we include bottomInset ourselves.
        height: TAB_BAR_HEIGHT + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: 0,
        // Strip all borders / shadows from the bar itself.
        borderTopWidth: 0,
        elevation: 0,
        shadowColor: colors.transparent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },

      // Each tab item is pinned to the content height (TAB_BAR_HEIGHT) so
      // the icon+label block is vertically centred within the visible bar.
      tabBarItemStyle: {
        height: TAB_BAR_HEIGHT,
        paddingTop: spacing[2],
        paddingBottom: spacing[1],
      },

      tabBarActiveTintColor: colors.tabBarActive,
      tabBarInactiveTintColor: colors.tabBarInactive,

      tabBarLabelStyle: {
        fontSize: 11,
        fontFamily: 'BeVietnamPro-Medium',
        marginTop: spacing[0.5],
        marginBottom: 0,
      },
    }),
    [colors, spacing, bottomInset],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: t('home.tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabIcon routeName={ROUTES.HOME} focused={focused} colors={colors} />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.BUDDIES}
        component={BuddiesScreen}
        options={{
          tabBarLabel: t('home.tabs.buddies'),
          tabBarIcon: ({ focused }) => (
            <TabIcon routeName={ROUTES.BUDDIES} focused={focused} colors={colors} />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.CREATE_POST}
        component={CreatePostScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <CreateTabButton {...props} colors={colors} shadows={shadows} />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{
          tabBarLabel: t('home.tabs.notifications'),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              routeName={ROUTES.NOTIFICATIONS}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.ROBI}
        component={RobiScreen}
        options={{
          tabBarLabel: t('home.tabs.robi'),
          tabBarIcon: ({ focused }) => (
            <TabIcon routeName={ROUTES.ROBI} focused={focused} colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default memo(BottomTabNavigator);
