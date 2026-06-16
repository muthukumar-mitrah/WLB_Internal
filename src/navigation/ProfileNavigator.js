import React, { memo, useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../theme';
import { Sidebar } from '../components/common';
import MyProfileScreen from '../screens/profile/MyProfileScreen';

const Drawer = createDrawerNavigator();

const ProfileNavigator = () => {
  const { colors } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      drawerType: 'front',
      drawerPosition: 'right',
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
      id="RightDrawer"
      screenOptions={screenOptions}
      drawerContent={(props) => <Sidebar {...props} />}
    >
      <Drawer.Screen name="MyProfileDrawerScreen" component={MyProfileScreen} />
    </Drawer.Navigator>
  );
};

export default memo(ProfileNavigator);
