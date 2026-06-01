/**
 * Root navigator — switches between Auth and Main stacks
 * based on authentication state from AuthContext
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';
import AuthNavigator from './AuthNavigator';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Main app screens go here once created
          // <RootStack.Screen name={ROUTES.MAIN} component={MainNavigator} />
          <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        ) : (
          <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
