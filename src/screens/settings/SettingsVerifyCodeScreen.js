/**
 * Screen 3: Verify Code (Settings Flow)
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import {
  AppText,
  Button,
  Header,
} from '../../components/common';
import { ToastService } from '../../components/common/Toast';
import { ROUTES } from '../../constants';
import createStyles from './styles';

const OTP_LENGTH = 5;

const SettingsVerifyCodeScreen = ({ navigation, route }) => {
  const { colors, spacing, borderRadius, iconSize } = useTheme();
  const { t } = useTranslation();
  const email = route.params?.email || '';

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [otpCode, setOtpCode] = useState('');

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleContinue = useCallback(() => {
    if (otpCode.length < OTP_LENGTH) return;
    navigation.navigate(ROUTES.SETTINGS_CREATE_PASSWORD, { email });
  }, [otpCode, email, navigation]);

  const handleResendCode = useCallback(() => {
    ToastService.show({
      type: 'success',
      message: t('auth.settingsPassword.resendCodeSuccess'),
    });
  }, [t]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.container}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <Header onBackPress={handleBack} transparent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emailIconContainer}>
          <Ionicons name="mail" size={iconSize['3xl']} color={colors.primary} />
        </View>
        <AppText variant="h3" color={colors.textPrimary} style={styles.successTitle}>
          {t('auth.settingsPassword.verifyCodeTitle')}
        </AppText>
        
        <View style={styles.verifySubheadingContainer}>
          <AppText 
            variant="body" 
            color={colors.textSecondary} 
            style={styles.verifySubheadingText}
          >
            {t('auth.settingsPassword.verifyCodeSubheadingPrefix')}
            <AppText variant="bodyMedium" color={colors.textPrimary}>
              {` ${email} `}
            </AppText>
            {t('auth.settingsPassword.verifyCodeSubheadingSuffix')}
          </AppText>
        </View>

        <View style={styles.otpWrapper}>
          <OtpInput
            numberOfDigits={OTP_LENGTH}
            onTextChange={setOtpCode}
            autoFocus
            focusColor={colors.borderFocused}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
            }}
          />
        </View>

        <Button
          testID="settings-verify-continue-btn"
          title={t('auth.settingsPassword.continueBtn')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          disabled={otpCode.length < OTP_LENGTH}
          style={styles.continueBtn}
        />
        <Button
          testID="settings-resend-code-btn"
          title={t('auth.settingsPassword.resendCodeBtn')}
          onPress={handleResendCode}
          variant="gray"
          size="lg"
          style={styles.primaryBtn}
          leftIcon={<MaterialIcons name="refresh" size={iconSize.md} color={colors.textSecondary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(SettingsVerifyCodeScreen);
