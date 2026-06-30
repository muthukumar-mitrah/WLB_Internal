/**
 * App.js — Root application component
 */
import './src/i18n';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { AuthProvider } from './src/context/AuthContext';
import { SurveyProvider } from './src/context/SurveyContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { FeedProvider } from './src/context/FeedContext';
import { NotificationProvider } from './src/context/NotificationContext';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from './src/components/common/Toast';
import SplashScreen from 'react-native-splash-screen'
import { GOOGLE_SIGN_IN_CONFIG } from './src/constants/index';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AppCore = () => {
  const { colors } = useTheme();

  useEffect(()=>{
    SplashScreen.hide()
    GoogleSignin.configure(GOOGLE_SIGN_IN_CONFIG, [])
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
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
          <SurveyProvider>
            <FeedProvider>
              <NotificationProvider>
                <BottomSheetModalProvider>
                  <AppCore />
                </BottomSheetModalProvider>
              </NotificationProvider>
            </FeedProvider>
          </SurveyProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
