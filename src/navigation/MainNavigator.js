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

import ChooseAIBuddyScreen from '../screens/aiBuddy/ChooseAIBuddyScreen';
import AIBuddyDetailsScreen from '../screens/aiBuddy/AIBuddyDetailsScreen';
import AISettingsScreen from '../screens/aiBuddy/AISettingsScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>  
    <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigator} />
    <Stack.Screen name={ROUTES.CONTACT_US} component={ContactUsScreen} />
    <Stack.Screen name={ROUTES.TERMS_OF_USE} component={TermsOfUseScreen} />
    <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
    
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
    
    <Stack.Screen name={ROUTES.CHOOSE_AI_BUDDY} component={ChooseAIBuddyScreen} />
    <Stack.Screen name={ROUTES.AI_BUDDY_DETAILS} component={AIBuddyDetailsScreen} />
    <Stack.Screen name={ROUTES.AI_SETTINGS} component={AISettingsScreen} />
  </Stack.Navigator>
);

export default memo(MainNavigator);
