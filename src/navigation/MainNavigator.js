/**
 * MainNavigator — Stack wrapper for the Drawer + Tabs.
 *
 * This stack allows future modal screens to overlay the entire tab/drawer structure.
 */
import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigator} />
  </Stack.Navigator>
);

export default memo(MainNavigator);
