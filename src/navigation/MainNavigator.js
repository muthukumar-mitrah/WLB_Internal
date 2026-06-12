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

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>  
    <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigator} />
    <Stack.Screen name={ROUTES.CONTACT_US} component={ContactUsScreen} />
    <Stack.Screen name={ROUTES.TERMS_OF_USE} component={TermsOfUseScreen} />
    <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
  </Stack.Navigator>
);

export default memo(MainNavigator);
