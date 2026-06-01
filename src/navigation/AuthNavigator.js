/**
 * Auth navigator — Screens accessible without login
 */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SetupProfileScreen from '../screens/auth/SetupProfileScreen';
import BasicInfoScreen from '../screens/auth/BasicInfoScreen';
import UploadImageScreen from '../screens/auth/BasicInfoScreen/UploadImageScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoginPasswordScreen from '../screens/auth/LoginScreen/LoginPasswordScreen';
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

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
    <Stack.Screen name={ROUTES.SETUP_PROFILE} component={SetupProfileScreen} />
    <Stack.Screen name={ROUTES.BASIC_INFO} component={BasicInfoScreen} />
    <Stack.Screen name={ROUTES.BASIC_INFO2} component={UploadImageScreen} />
    <Stack.Screen name={ROUTES.WELCOME_SURVEY} component={WelcomeSurveyScreen} />
    <Stack.Screen name={ROUTES.SURVEY_Q1} component={SurveyQ1Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q2} component={SurveyQ2Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q3} component={SurveyQ3Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q4} component={SurveyQ4Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q5} component={SurveyQ5Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q6} component={SurveyQ6Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q7} component={SurveyQ7Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q8} component={SurveyQ8Screen} />
    <Stack.Screen name={ROUTES.SURVEY_Q9} component={SurveyQ9Screen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.LOGIN_PASSWORD} component={LoginPasswordScreen} />
    {/* Add ForgotPassword etc. here */}
  </Stack.Navigator>
);

export default AuthNavigator;
