import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n/useTranslation';
import { ROUTES, STORAGE_KEYS } from '../constants';
import { storage } from '../utils/storage';
import { useAppTour } from '../hooks/useAppTour';
import { TourGuideZone } from 'rn-tourguide';

import HomeScreen from '../screens/home/HomeScreen';
import BuddiesSearchScreen from '../screens/home/BuddiesSearchScreen';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import NotificationsScreen from '../screens/home/NotificationScreen';
import RobiScreen from '../screens/home/RobiScreen';
import AiBuddyDisclaimerModal from '../components/home/AiBuddyDisclaimerModal';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 70;

const ICON_CONTAINER = 28;
const ICON_SIZE = 22;

const CREATE_BUTTON_SIZE = 56;
const CREATE_BUTTON_LIFT = 16;

const TAB_MASK_OFFSET = 4;
const TAB_TOOLTIP_BOTTOM_OFFSET = 90;

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

const NoRippleTabButton = (props) => (
  <TouchableOpacity {...props} activeOpacity={1} />
);

const TabIcon = memo(({ routeName, focused, colors, step }) => {
  const { t } = useTranslation();
  const icons = TAB_ICONS[routeName];
  if (!icons) return null;

  const isRobi = routeName === ROUTES.ROBI;
  const source = focused ? icons.active : icons.inactive;

  const image = (
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
  );

  return (
    <View style={tabIconStyles.container}>
      {step ? (
        <TourGuideZone
          zone={step.order}
          shape="circle"
          maskOffset={TAB_MASK_OFFSET}
          keepTooltipPosition={routeName !== ROUTES.HOME && routeName !== ROUTES.BUDDIES}
          tooltipBottomOffset={TAB_TOOLTIP_BOTTOM_OFFSET}
          text={JSON.stringify({ title: t(step.titleKey), body: t(step.descKey) })}
        >
          {image}
        </TourGuideZone>
      ) : (
        image
      )}
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

const CreateTabButton = memo(({ onPress, colors, shadows, step }) => {
  const { t } = useTranslation();
  const image = (
    <Image
      source={TAB_ICONS[ROUTES.CREATE_POST].active}
      style={createBtnStyles.icon}
      resizeMode="contain"
    />
  );

  return (
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
        {step ? (
          <TourGuideZone
            zone={step.order}
            shape="circle"
            maskOffset={TAB_MASK_OFFSET}
            keepTooltipPosition={true}
            tooltipBottomOffset={TAB_TOOLTIP_BOTTOM_OFFSET}
            text={JSON.stringify({ title: t(step.titleKey), body: t(step.descKey) })}
          >
            {image}
          </TourGuideZone>
        ) : (
          image
        )}
      </View>
    </TouchableOpacity>
  );
});

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

const BottomTabNavigator = () => {
  const { colors, spacing, shadows } = useTheme();
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

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

  const handleRobiTabPress = useCallback(
    async (e, navigation) => {
      e.preventDefault();
      const accepted = await storage.getItem(
        STORAGE_KEYS.AI_BUDDY_DISCLAIMER_ACCEPTED,
        false,
      );
      if (accepted === true) {
        navigation.navigate(ROUTES.ROBI);
      } else {
        setPendingNavigation(() => () => navigation.navigate(ROUTES.ROBI));
        setDisclaimerVisible(true);
      }
    },
    [],
  );

  const handleDisclaimerClose = useCallback(() => {
    setDisclaimerVisible(false);
    setPendingNavigation(null);
  }, []);

  const handleDisclaimerContinue = useCallback(
    async (dontShowAgain) => {
      if (dontShowAgain) {
        await storage.setItem(
          STORAGE_KEYS.AI_BUDDY_DISCLAIMER_ACCEPTED,
          true,
        );
      }
      setDisclaimerVisible(false);
      if (pendingNavigation) {
        pendingNavigation();
        setPendingNavigation(null);
      }
    },
    [pendingNavigation],
  );

  const handleAiSettings = useCallback(() => {
    setDisclaimerVisible(false);
    setPendingNavigation(null);
  }, []);

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarButton: NoRippleTabButton,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: colors.tabBarBackground,
        height: TAB_BAR_HEIGHT + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: 0,
        borderTopWidth: 0,
        elevation: 0,
        shadowColor: colors.transparent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      tabBarItemStyle: {
        height: TAB_BAR_HEIGHT,
        paddingTop: spacing[2],
        paddingBottom: spacing[1],
      },
      tabBarActiveTintColor: colors.tabBarActive,
      tabBarInactiveTintColor: colors.tabBarInactive,
      tabBarLabelStyle: {
        fontSize: 10,
        fontFamily: 'BeVietnamPro-Medium',
        marginTop: spacing[0.5],
        marginBottom: 0,
      },
    }),
    [colors, spacing, bottomInset],
  );

  const homeTabOptions = useMemo(
    () => ({
      tabBarLabel: t('home.tabs.home'),
      tabBarIcon: ({ focused }) => (
        <TabIcon
          routeName={ROUTES.HOME}
          focused={focused}
          colors={colors}
          step={stepMap.home}
        />
      ),
    }),
    [colors, stepMap.home, t],
  );

  const buddiesTabOptions = useMemo(
    () => ({
      tabBarLabel: t('home.tabs.buddies'),
      tabBarIcon: ({ focused }) => (
        <TabIcon
          routeName={ROUTES.BUDDIES}
          focused={focused}
          colors={colors}
          step={stepMap.findBuddy}
        />
      ),
    }),
    [colors, stepMap.findBuddy, t],
  );

  const createPostTabOptions = useMemo(
    () => ({
      tabBarLabel: () => null,
      tabBarIcon: () => null,
      tabBarButton: (props) => (
        <CreateTabButton
          {...props}
          colors={colors}
          shadows={shadows}
          step={stepMap.createPost}
        />
      ),
    }),
    [colors, shadows, stepMap.createPost],
  );

  const notificationsTabOptions = useMemo(
    () => ({
      tabBarLabel: t('home.tabs.notifications'),
      tabBarIcon: ({ focused }) => (
        <TabIcon
          routeName={ROUTES.NOTIFICATIONS}
          focused={focused}
          colors={colors}
          step={stepMap.notifications}
        />
      ),
    }),
    [colors, stepMap.notifications, t],
  );

  const robiTabOptions = useMemo(
    () => ({
      tabBarLabel: t('home.tabs.robi'),
      tabBarIcon: ({ focused }) => (
        <TabIcon
          routeName={ROUTES.ROBI}
          focused={focused}
          colors={colors}
          step={stepMap.aiBuddy}
        />
      ),
    }),
    [colors, stepMap.aiBuddy, t],
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name={ROUTES.HOME}
          component={HomeScreen}
          options={homeTabOptions}
        />
        <Tab.Screen
          name={ROUTES.BUDDIES}
          component={BuddiesSearchScreen}
          options={buddiesTabOptions}
        />
        <Tab.Screen
          name={ROUTES.CREATE_POST}
          component={CreatePostScreen}
          options={createPostTabOptions}
        />
        <Tab.Screen
          name={ROUTES.NOTIFICATIONS}
          component={NotificationsScreen}
          options={notificationsTabOptions}
        />
        <Tab.Screen
          name={ROUTES.ROBI}
          component={RobiScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => handleRobiTabPress(e, navigation),
          })}
          options={robiTabOptions}
        />
      </Tab.Navigator>

      <AiBuddyDisclaimerModal
        visible={disclaimerVisible}
        onClose={handleDisclaimerClose}
        onContinue={handleDisclaimerContinue}
        onAiSettings={handleAiSettings}
      />
    </View>
  );
};

export default memo(BottomTabNavigator);
