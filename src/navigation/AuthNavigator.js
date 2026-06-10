/**
 * Auth navigator — Screens accessible without login
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SetupProfileScreen from '../screens/auth/SetupProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoginPasswordScreen from '../screens/auth/LoginScreen/LoginPasswordScreen'
import UploadImageScreen from '../screens/auth/BasicInfoScreen/UploadImageScreen';
import BasicInfoScreen from '../screens/auth/BasicInfoScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerificationCodeScreen from '../screens/auth/ForgotPasswordScreen/VerificationCode';
import ChangePasswordScreen from '../screens/auth/ForgotPasswordScreen/ChangePassword';
import PasswordResetSuccessScreen from '../screens/auth/ForgotPasswordScreen/PasswordResetSuccess';
import WelcomeSurveyScreen from '../screens/auth/SurveyScreen/WelcomeSurveyScreen';
import SurveyQ1Screen from '../screens/auth/SurveyScreen/SurveyQ1Screen';
import SurveyQ2Screen from '../screens/auth/SurveyScreen/SurveyQ2Screen';
import SurveyQ3Screen from '../screens/auth/SurveyScreen/SurveyQ3Screen';
import SurveyQ4Screen from '../screens/auth/SurveyScreen/SurveyQ4Screen';
import SurveyQ5Screen from '../screens/auth/SurveyScreen/SurveyQ5Screen';
import SurveyQ6Screen from '../screens/auth/SurveyScreen/SurveyQ6Screen';
import SurveyQ7Screen from '../screens/auth/SurveyScreen/SurveyQ7Screen';
import SurveyQ8Screen from '../screens/auth/SurveyScreen/SurveyQ8Screen';
import SurveyQ9Screen from '../screens/auth/SurveyScreen/SurveyQ9Screen';
import MatchLoadingScreen from '../screens/auth/SurveyScreen/MatchLoadingScreen';
import MatchResultScreen from '../screens/auth/SurveyScreen/MatchResultScreen';
import AiBuddyScreen from '../screens/auth/SurveyScreen/AiBuddyScreen';
import FindEmmaScreen from '../screens/auth/SurveyScreen/FindEmmaScreen';
import ExploreMatchesScreen from '../screens/auth/SurveyScreen/ExploreMatchesScreen';

const Stack = createNativeStackNavigator();

const navigatorOptions = {
  headerShown: false,
  animation: 'slide_from_right',
}

const screenOptions = {
  gestureEnabled: false
}

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={navigatorOptions}>
    <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
    <Stack.Screen name={ROUTES.SETUP_PROFILE} component={SetupProfileScreen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.LOGIN_PASSWORD} component={LoginPasswordScreen} />
    <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    <Stack.Screen name={ROUTES.VERIFICATION_CODE} component={VerificationCodeScreen} />
    <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePasswordScreen} />
    <Stack.Screen name={ROUTES.PASSWORD_RESET_SUCCESS} component={PasswordResetSuccessScreen} />
    <Stack.Screen name={ROUTES.BASIC_INFO} component={BasicInfoScreen} />
    <Stack.Screen name={ROUTES.BASIC_INFO2} component={UploadImageScreen} />
    <Stack.Screen name={ROUTES.WELCOME_SURVEY} options={screenOptions} component={WelcomeSurveyScreen} />
    <Stack.Screen name={ROUTES.SURVEY_Q1} options={screenOptions} component={SurveyQ1Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q2} options={screenOptions} component={SurveyQ2Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q3} options={screenOptions} component={SurveyQ3Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q4} options={screenOptions} component={SurveyQ4Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q5} options={screenOptions} component={SurveyQ5Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q6} options={screenOptions} component={SurveyQ6Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q7} options={screenOptions} component={SurveyQ7Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q8} options={screenOptions} component={SurveyQ8Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q9} options={screenOptions} component={SurveyQ9Screen} />
    <Stack.Screen name={ROUTES.MATCH_LOADING} component={MatchLoadingScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name={ROUTES.MATCH_RESULT} component={MatchResultScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name={ROUTES.AI_BUDDY} component={AiBuddyScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name={ROUTES.FIND_EMMA} component={FindEmmaScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name={ROUTES.EXPLORE_MATCHES} component={ExploreMatchesScreen} options={{ animation: 'slide_from_right' }} />
  </Stack.Navigator>
);

export default AuthNavigator;

