/**
 * Root navigator — top-level navigation container.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { Loader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <Loader fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <RootStack.Screen name={ROUTES.MAIN} component={MainNavigator} />
          ) : (
            <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
