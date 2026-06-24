/**
 * MainNavigator — Stack wrapper for the Drawer + Tabs.
 */
import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants';
import DrawerNavigator from './DrawerNavigator';
import ContactUsScreen from '../screens/drawer/ContactUsScreen';
import TermsOfUseScreen from '../screens/legal/TermsOfUseScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';
import ProfileNavigator from './ProfileNavigator';
import ViewProfileScreen from '../screens/profile/ViewProfileScreen';
import UpdateProfileScreen from '../screens/profile/UpdateProfileScreen';
import PortraitViewScreen from '../screens/profile/PortraitViewScreen';
import WeightUpdateScreen from '../screens/profile/WeightUpdateScreen';
import PrivacySelectionScreen from '../screens/profile/PrivacySelectionScreen';
import GenderSelectionScreen from '../screens/profile/GenderSelectionScreen';
import CountrySelectionScreen from '../screens/profile/CountrySelectionScreen';
import DateOfBirthScreen from '../screens/profile/DateOfBirthScreen';
import ReportUserScreen from '../screens/profile/ReportUserScreen';
import BlockedUsersScreen from '../screens/drawer/BlockedUsersScreen';
import AwardScreen from '../screens/drawer/AwardScreen';
import LeaderboardScreen from '../screens/drawer/LeaderboardScreen';
import PostFilterScreen from '../screens/home/PostFilterScreen';
import BuddySearchResultScreen from '../screens/home/BuddiesSearchScreen/BuddySearchResultScreen';

import ChooseAIBuddyScreen from '../screens/aiBuddy/ChooseAIBuddyScreen';
import AIBuddyDetailsScreen from '../screens/aiBuddy/AIBuddyDetailsScreen';
import AISettingsScreen from '../screens/aiBuddy/AISettingsScreen';

import SettingsChangePasswordScreen from '../screens/settings/SettingsChangePasswordScreen';
import SettingsForgotPasswordScreen from '../screens/settings/SettingsForgotPasswordScreen';
import SettingsVerifyCodeScreen from '../screens/settings/SettingsVerifyCodeScreen';
import SettingsCreatePasswordScreen from '../screens/settings/SettingsCreatePasswordScreen';
import SettingsPasswordSuccessScreen from '../screens/settings/SettingsPasswordSuccessScreen';
import CreateGroupScreen from '../screens/home/CreateGroupScreen'
import AccountSettingScreen from '../screens/AccountSetting/AccountSettingScreen';
import ProfileVisibilityScreen from '../screens/AccountSetting/ProfileVisibilityScreen';
import WeightVisibilityScreen from '../screens/AccountSetting/WeightVisibilityScreen';
import TrackProgressScreen from '../screens/TrackProgress/TrackProgressScreen';
import GroupDetailsScreen from '../screens/home/GroupDetailsScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigator} />
    <Stack.Screen name={ROUTES.CONTACT_US} component={ContactUsScreen} />
    <Stack.Screen name={ROUTES.TERMS_OF_USE} component={TermsOfUseScreen} />
    <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
    <Stack.Screen name={ROUTES.BLOCKED_USER} component={BlockedUsersScreen} />
    <Stack.Screen name={ROUTES.AWARDS} component={AwardScreen} />
    <Stack.Screen name={ROUTES.LEADER_BOARD} component={LeaderboardScreen} />
    <Stack.Screen name={ROUTES.POST_FILTER} component={PostFilterScreen} />
    <Stack.Screen name={ROUTES.BUDDY_SEARCH_RESULT} component={BuddySearchResultScreen} />

    {/* Profile flow */}
    <Stack.Screen name={ROUTES.MY_PROFILE} component={ProfileNavigator} />
    <Stack.Screen name={ROUTES.VIEW_PROFILE} component={ViewProfileScreen} />
    <Stack.Screen name={ROUTES.UPDATE_PROFILE} component={UpdateProfileScreen} />
    <Stack.Screen name={ROUTES.PORTRAIT_VIEW} component={PortraitViewScreen} />
    <Stack.Screen name={ROUTES.WEIGHT_UPDATE} component={WeightUpdateScreen} />
    <Stack.Screen name={ROUTES.PRIVACY_SELECTION} component={PrivacySelectionScreen} />
    <Stack.Screen name={ROUTES.GENDER_SELECTION} component={GenderSelectionScreen} />
    <Stack.Screen name={ROUTES.COUNTRY_SELECTION} component={CountrySelectionScreen} />
    <Stack.Screen name={ROUTES.DOB_SELECTION} component={DateOfBirthScreen} />
    <Stack.Screen name={ROUTES.REPORT_USER} component={ReportUserScreen} />
    <Stack.Screen name={ROUTES.TRACK_PROGRESS} component={TrackProgressScreen} />

    <Stack.Screen name={ROUTES.CHOOSE_AI_BUDDY} component={ChooseAIBuddyScreen} />
    <Stack.Screen name={ROUTES.AI_BUDDY_DETAILS} component={AIBuddyDetailsScreen} />
    <Stack.Screen name={ROUTES.AI_SETTINGS} component={AISettingsScreen} />

    {/* Settings — Change Password flow */}
    <Stack.Screen name={ROUTES.SETTINGS_CHANGE_PASSWORD} component={SettingsChangePasswordScreen} />
    <Stack.Screen name={ROUTES.SETTINGS_FORGOT_PASSWORD} component={SettingsForgotPasswordScreen} />
    <Stack.Screen name={ROUTES.SETTINGS_VERIFY_CODE} component={SettingsVerifyCodeScreen} />
    <Stack.Screen name={ROUTES.SETTINGS_CREATE_PASSWORD} component={SettingsCreatePasswordScreen} />
    <Stack.Screen name={ROUTES.SETTINGS_PASSWORD_SUCCESS} component={SettingsPasswordSuccessScreen} />

    {/* Account Settings flow */}
    <Stack.Screen name={ROUTES.ACCOUNT_SETTINGS} component={AccountSettingScreen} />
    <Stack.Screen name={ROUTES.PROFILE_VISIBILITY} component={ProfileVisibilityScreen} />
    <Stack.Screen name={ROUTES.WEIGHT_VISIBILITY} component={WeightVisibilityScreen} />

    {/* Group flow */}
    <Stack.Screen name={ROUTES.CREATE_GROUP} component={CreateGroupScreen} />
    <Stack.Screen name={ROUTES.GROUP_DETAILS} component={GroupDetailsScreen} />
  </Stack.Navigator>
);

export default memo(MainNavigator);
