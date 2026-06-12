import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { OtpInput } from 'react-native-otp-entry';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  SafeContainer,
} from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

const OTP_LENGTH = 5;

const VerificationCodeScreen = ({ navigation, route }) => {
  const { colors, spacing, borderRadius, iconSize, fonts } = useTheme();
  const { t } = useTranslation();
  const email = route.params?.email || '';

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [otpCode, setOtpCode] = useState('');

  const handleBack = useCallback(() => {
    if(navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleOtpFilled = useCallback((code) => {
    setOtpCode(code);
  }, []);

  const handleContinue = useCallback(() => {
    if(otpCode.length < OTP_LENGTH) return;
    navigation.navigate(ROUTES.CHANGE_PASSWORD, { email });
  }, [otpCode, email, navigation]);

  const handleResendCode = useCallback(() => {
    // TODO: Call forgotPassword API again to resend OTP
  }, [email]);

  return (
    <SafeContainer avoidKeyboard edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={iconSize.md} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emailIconContainer}>
          <Ionicons name="mail" size={iconSize['2xl']} color={colors.primary} />
        </View>
        <AppText variant="h2" color={colors.textPrimary} style={styles.heading}>
          {t('auth.verificationCode.heading')}
        </AppText>
        <View style={styles.descriptionContainer}>
          <AppText variant="body" color={colors.textSecondary}>
            {t('auth.verificationCode.subheadingPrefix')}
          </AppText>
          <AppText variant="bodyMedium" color={colors.textPrimary}>
            {email || 'muthu@gmail.com'}
          </AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {t('auth.verificationCode.subheadingSuffix')}
          </AppText>
        </View>
        <View style={styles.otpContainer}>
          <OtpInput
            numberOfDigits={OTP_LENGTH}
            onTextChange={setOtpCode}
            onFilled={handleOtpFilled}
            autoFocus
            focusColor={colors.borderFocused}
            theme={{
              containerStyle: {
                width: '100%',
              },
              pinCodeContainerStyle: {
                width: 52,
                height: 56,
                borderRadius: borderRadius.md,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                backgroundColor: colors.inputBackground,
                marginHorizontal: spacing[1],
              },
              focusedPinCodeContainerStyle: {
                borderColor: colors.borderFocused,
                borderWidth: 2,
              },
              pinCodeTextStyle: {
                fontFamily: fonts.fontFamily.semiBold,
                fontSize: fonts.fontSize.xl,
                color: colors.textPrimary,
              },
            }}
          />
        </View>
        <Button
          testID="verification-code-continue-btn"
          title={t('auth.verificationCode.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          disabled={otpCode.length < OTP_LENGTH}
          style={styles.verificationContinueBtn}
        />
        <Button
          testID="resend-code-btn"
          title={t('auth.verificationCode.resendCode')}
          onPress={handleResendCode}
          variant="gray"
          size="lg"
          style={styles.verificationContinueBtn}
          leftIcon={
            <MaterialIcons name="refresh" size={iconSize.md} color={colors.textSecondary} />
          }
        />
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(VerificationCodeScreen);
