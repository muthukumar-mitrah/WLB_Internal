import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  InputBox,
  SafeContainer,
} from '../../../components/common';
import { validateEmail } from '../../../utils/validation';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

// ─── Screen 1: Forgot Password ───────────────────────────────────────────────
const ForgotPasswordScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius, iconSize } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [email, setEmail] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const error = useMemo(() => {
    if(!isDirty) return '';
    const result = validateEmail(email);
    return result.valid ? '' : t(result.message);
  }, [email, isDirty, t]);

  const handleSendResetLink = useCallback(() => {
    setIsDirty(true);
    const result = validateEmail(email);
    if(!result.valid) return;
    navigation.navigate(ROUTES.VERIFICATION_CODE, { email: email.trim() });
  }, [email, navigation]);

  const handleBack = useCallback(() => {
    if(navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

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
        <AppText variant="h2" color={colors.textPrimary} style={styles.heading}>
          {t('auth.forgotPassword.heading')}
        </AppText>
        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.forgotPassword.subheading')}
        </AppText>
        <View style={styles.emailSection}>
          <AppText variant="titleMedium" color={colors.textPrimary} style={styles.emailLabel}>
            {t('auth.forgotPassword.emailLabel')}
          </AppText>
          <InputBox
            testID="forgot-password-email-input"
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleSendResetLink}
          />
        </View>
        <Button
          testID="forgot-password-send-btn"
          title={t('auth.forgotPassword.sendResetLink')}
          onPress={handleSendResetLink}
          variant="primary"
          size="lg"
          style={styles.continueBtn}
          rightIcon={
            <Ionicons name="arrow-forward" size={iconSize.md} color={colors.white} />
          }
        />
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(ForgotPasswordScreen);
