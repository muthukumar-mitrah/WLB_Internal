/**
 * Root navigator — top-level navigation container.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuth } from '../../src/context/AuthContext';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        <RootStack.Screen name={ROUTES.MAIN} component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator;
