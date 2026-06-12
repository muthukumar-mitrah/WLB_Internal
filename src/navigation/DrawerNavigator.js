/**
 * DrawerNavigator — side drawer that wraps the BottomTabNavigator.
 */
import React, { memo, useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../theme';
import { Sidebar } from '../components/common';
import { ROUTES } from '../constants';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      drawerType: 'front',
      drawerStyle: {
        backgroundColor: colors.background,
        width: 300,
      },
      overlayColor: colors.overlay,
      swipeEnabled: true,
    }),
    [colors],
  );

  return (
    <Drawer.Navigator
      screenOptions={screenOptions}
      drawerContent={(props) => <Sidebar {...props} />}
    >
      <Drawer.Screen name={ROUTES.HOME_TABS} component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default memo(DrawerNavigator);
