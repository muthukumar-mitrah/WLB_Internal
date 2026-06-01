/**
 * App.js — Root application component
 * Sets up: i18n, Theme, Context Providers, Navigation, Toast
 */
import './src/i18n'; // ← initialize i18next before any screen renders
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { SurveyProvider } from './src/context/SurveyContext';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from './src/components/common/Toast';
import SplashScreen from 'react-native-splash-screen'

const AppCore = () => {
  const { colors } = useTheme();

  useEffect(()=>{
    SplashScreen.hide()
  },[])

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <RootNavigator />
      <Toast />
    </View>
  );
};

const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <SurveyProvider>
            <AppCore />
          </SurveyProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
