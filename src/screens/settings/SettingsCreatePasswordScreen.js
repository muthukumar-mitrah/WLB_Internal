/**
 * Screen 4: Create New Password (Settings Flow)
 */
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';
import {
  AppText,
  Button,
  Header,
  InputBox,
} from '../../components/common';
import { validatePassword, validatePasswordMatch } from '../../utils/validation';
import { ROUTES } from '../../constants';
import createStyles from './styles';

const SettingsCreatePasswordScreen = ({ navigation, route }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const email = route.params?.email || '';

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const confirmRef = useRef(null);

  const newPasswordError = useMemo(() => {
    if (!isDirty) return '';
    const result = validatePassword(newPassword);
    return result.valid ? '' : t(result.message);
  }, [newPassword, isDirty, t]);

  const confirmPasswordError = useMemo(() => {
    if (!isDirty) return '';
    const result = validatePasswordMatch(newPassword, confirmPassword);
    return result.valid ? '' : t(result.message);
  }, [newPassword, confirmPassword, isDirty, t]);

  const isFormValid = useMemo(() => {
    const pwResult = validatePassword(newPassword);
    const matchResult = validatePasswordMatch(newPassword, confirmPassword);
    return pwResult.valid && matchResult.valid;
  }, [newPassword, confirmPassword]);

  const handleResetPassword = useCallback(() => {
    setIsDirty(true);
    if (!isFormValid) return;
    navigation.navigate(ROUTES.SETTINGS_PASSWORD_SUCCESS);
  }, [isFormValid, navigation]);

  const handleCancel = useCallback(() => {
    navigation.navigate(ROUTES.DRAWER);
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <Header     
        onBackPress={handleBack}
        transparent={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h2" color={colors.textPrimary} >
          {t('auth.settingsPassword.createPasswordTitle')}
        </AppText>

        <View style={[styles.headingSection, { marginTop: spacing[2] }]}>
          <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
            {t('auth.settingsPassword.createPasswordSubheading')}
          </AppText>
        </View>

        <View style={styles.inputSection}>
          <InputBox
            testID="settings-new-password-input"
            placeholder={t('auth.settingsPassword.newPasswordPlaceholder')}
            value={newPassword}
            onChangeText={setNewPassword}
            error={newPasswordError}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
        </View>

        <View style={styles.inputSection}>
          <InputBox
            ref={confirmRef}
            testID="settings-confirm-password-input"
            placeholder={t('auth.settingsPassword.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleResetPassword}
          />
        </View>

        <Button
          testID="settings-reset-password-btn"
          title={t('auth.settingsPassword.resetPasswordBtn')}
          onPress={handleResetPassword}
          variant="primary"
          size="lg"
          style={[styles.primaryBtn, { marginTop: spacing[2] }]}
        />

        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={0.7}
          style={styles.cancelBtn}
        >
          <AppText variant="bodyMedium" color={colors.primary}>
            {t('auth.settingsPassword.cancelBtn')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(SettingsCreatePasswordScreen);
