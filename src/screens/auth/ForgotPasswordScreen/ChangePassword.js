import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
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
import { validatePassword, validatePasswordMatch } from '../../../utils/validation';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

const ChangePasswordScreen = ({ navigation, route }) => {
  const { colors, spacing, borderRadius, iconSize } = useTheme();
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
    if(!isDirty) return '';
    const result = validatePassword(newPassword);
    return result.valid ? '' : t(result.message);
  }, [newPassword, isDirty, t]);

  const confirmPasswordError = useMemo(() => {
    if(!isDirty) return '';
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
    if(!isFormValid) return;
    navigation.navigate(ROUTES.PASSWORD_RESET_SUCCESS);
  }, [isFormValid, email, newPassword, navigation]);

  const handleBack = useCallback(() => {
    if(navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleCancelBackToSignIn = useCallback(() => {
    navigation.navigate(ROUTES.LOGIN);
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
        <AppText variant="h2" color={colors.textPrimary} style={styles.changePasswordHeading}>
          {t('auth.changePassword.heading')}
        </AppText>
        <AppText variant="subtitle" color={colors.textSecondary} style={styles.changePasswordSubheading}>
          {t('auth.changePassword.subheading')}
        </AppText>
        <View style={styles.inputSection}>
          <InputBox
            testID="change-password-new-input"
            placeholder={t('auth.changePassword.newPasswordPlaceholder')}
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
            testID="change-password-confirm-input"
            placeholder={t('auth.changePassword.confirmPasswordPlaceholder')}
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
          testID="change-password-reset-btn"
          title={t('auth.changePassword.resetPassword')}
          onPress={handleResetPassword}
          variant="primary"
          size="lg"
          style={styles.changePasswordContinueBtn}
        />
        <TouchableOpacity
          onPress={handleCancelBackToSignIn}
          activeOpacity={0.7}
          style={styles.cancelRow}>
          <AppText variant="bodyMedium" color={colors.primary}>
            {t('auth.changePassword.cancelBackToSignIn')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(ChangePasswordScreen);
