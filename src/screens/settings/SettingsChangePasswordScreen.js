/**
 * Screen 1: Change Password (Settings Flow)
 * Sidebar → Change Password
 */
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const SettingsChangePasswordScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const newRef = useRef(null);
  const confirmRef = useRef(null);

  const currentPasswordError = useMemo(() => {
    if (!isDirty) return '';
    return currentPassword.trim() === '' ? t('validation.passwordRequired') : '';
  }, [currentPassword, isDirty, t]);

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
    if (!currentPassword.trim()) return false;
    const pwResult = validatePassword(newPassword);
    const matchResult = validatePasswordMatch(newPassword, confirmPassword);
    return pwResult.valid && matchResult.valid;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSavePassword = useCallback(() => {
    setIsDirty(true);
    if (!isFormValid) return;
    // Navigate directly — backend integration pending
    navigation.navigate(ROUTES.SETTINGS_PASSWORD_SUCCESS);
  }, [isFormValid, navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate(ROUTES.SETTINGS_FORGOT_PASSWORD);
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate(ROUTES.HOME);
  }, [navigation]);

  const footerStyle = useMemo(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing[6],
    paddingBottom: Math.max(insets.bottom, spacing[4]),
    paddingTop: spacing[3],
    backgroundColor: colors.background,
  }), [insets.bottom, spacing, colors.background]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} translucent={false} />
      <Header
        title={t('auth.settingsPassword.changePasswordTitle')}
        onBackPress={handleBack}
        transparent={true}
        titleAlign="left"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.inputSection, { marginTop: spacing[4] }]}>
            <InputBox
              testID="settings-current-password-input"
              placeholder={t('auth.settingsPassword.currentPasswordPlaceholder')}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              error={currentPasswordError}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => newRef.current?.focus()}
            />
            <TouchableOpacity
              onPress={handleForgotPassword}
              activeOpacity={0.7}
              style={styles.forgotLink}
            >
              <AppText variant="caption" color={colors.error}>
                {t('auth.settingsPassword.forgotPasswordLink')}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <InputBox
              ref={newRef}
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
              onSubmitEditing={handleSavePassword}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed footer — outside KeyboardAvoidingView so it never moves */}
      <View style={footerStyle}>
        <Button
          testID="settings-save-password-btn"
          title={t('auth.settingsPassword.savePasswordBtn')}
          onPress={handleSavePassword}
          variant="primary"
          size="lg"
          style={styles.primaryBtn}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(SettingsChangePasswordScreen);
