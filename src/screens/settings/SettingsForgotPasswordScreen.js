import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import {
  AppText,
  Button,
  Header,
  InputBox,
} from '../../components/common';
import { validateEmail } from '../../utils/validation';
import { ROUTES } from '../../constants';
import createStyles from './styles';

const SettingsForgotPasswordScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius, iconSize } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [email, setEmail] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const emailError = useMemo(() => {
    if (!isDirty) return '';
    const result = validateEmail(email);
    return result.valid ? '' : t(result.message);
  }, [email, isDirty, t]);

  const handleSendResetLink = useCallback(() => {
    setIsDirty(true);
    const result = validateEmail(email);
    if (!result.valid) return;
    // Navigate directly — backend integration pending
    navigation.navigate(ROUTES.SETTINGS_VERIFY_CODE, { email: email.trim() });
  }, [email, navigation]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);


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
        <AppText variant="h4" color={colors.textPrimary} style={styles.successTitle}>
          {t('auth.settingsPassword.forgotPasswordTitle')}
        </AppText>

        <View style={styles.headingSection}>
          <AppText variant="body" color={colors.textSecondary} style={[styles.subheading, styles.textAlignCenter]}>
            {t('auth.settingsPassword.forgotPasswordSubheading')}
          </AppText>
        </View>

        <View style={styles.inputSection}>
          <AppText variant="body" color={colors.textPrimary} style={styles.emailLabel}>
            {t('auth.settingsPassword.emailLabel')}
          </AppText>
          <InputBox
            testID="settings-forgot-email-input"
            placeholder={t('auth.settingsPassword.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleSendResetLink}
          />
        </View>

        <Button
          testID="settings-send-reset-link-btn"
          title={t('auth.settingsPassword.sendResetLinkBtn')}
          onPress={handleSendResetLink}
          variant="primary"
          size="lg"
          style={styles.primaryBtn}
          textStyle={styles.primaryBtnText}
          rightIcon={<Ionicons name="arrow-forward" size={iconSize.md} color={colors.white} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(SettingsForgotPasswordScreen);
