import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  InputBox,
  SafeContainer,
  Loader,
} from '../../../components/common';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

// ─── Logo Header ────────────────────────────────────────────────────────
const LogoHeader = memo(({ styles }) => (
  <View style={styles.illustrationWrapper}>
    <View style={styles.mascotContainer}>
      <Image 
        source={require('../../../assets/images/wlb_logo.png')} 
        style={styles.mascotImage} 
        resizeMode="contain" 
      />
    </View>
  </View>
));

// ─── Screen ───────────────────────────────────────────────────────────────────
const LoginPasswordScreen = ({ navigation, route }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { loginWithEmail, loading, error: authError } = useAuth();
  const { t } = useTranslation();

  const email = route.params?.email || '';

  // Capitalize name from email prefix (e.g. sarah@gmail.com -> Sarah)
  const name = useMemo(() => {
    if (!email) return '';
    const prefix = email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }, [email]);

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const error = useMemo(() => {
    if (!isDirty) {
      return '';
    }
    if (!password) {
      return t('validation.passwordRequired');
    }
    if (password.length < 8) {
      return t('validation.passwordTooShort');
    }
    return '';
  }, [password, isDirty, t]);

  const handleLogin = useCallback(async () => {
    setIsDirty(true);
    if (!password || password.length < 8) {
      return;
    }
    await loginWithEmail({ email, password });
  }, [email, password, loginWithEmail]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate(ROUTES.FORGOT_PASSWORD);
  }, [navigation]);

  return (
    <SafeContainer avoidKeyboard edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
        translucent={false}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing[6], paddingBottom: spacing[6] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Mascot Logo ── */}
        <View style={{ marginTop: spacing[10], marginBottom: spacing[4] }}>
          <LogoHeader styles={styles} />
        </View>

        {/* ── Heading ── */}
        <AppText variant="h1" color={colors.textPrimary} style={styles.heading}>
          {t('auth.loginPassword.heading')}
        </AppText>

        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.loginPassword.subheadingWithName', { name: name || 'User' })}
        </AppText>

        {/* ── Password Input ── */}
        <View style={{ marginTop: spacing[8], width: '100%' }}>
          <AppText variant="label" color={colors.textSecondary} style={styles.passwordLabel}>
            {t('auth.loginPassword.passwordLabel')}
          </AppText>
          <InputBox
            testID="login-password-input"
            placeholder={t('auth.loginPassword.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            error={error}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            inputStyle={styles.passwordInput}
          />
        </View>

        {/* ── Options Row (Remember Me & Forgot Password) ── */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(p => !p)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={rememberMe ? 'checkbox' : 'square-outline'}
              size={20}
              color={rememberMe ? colors.primary : colors.textSecondary}
            />
            <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.rememberMeText}>
              {t('auth.loginPassword.rememberMe')}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword}>
            <AppText variant="bodyMedium" color={colors.textPrimary} style={styles.forgotPasswordText}>
              {t('auth.loginPassword.forgotPassword')}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Sign In Button ── */}
        {loading ? (
          <View style={{ marginTop: spacing[4] }}>
            <Loader visible size="large" />
          </View>
        ) : (
          <Button
            testID="login-signin-btn"
            title={t('common.buttons.signIn')}
            onPress={handleLogin}
            variant="primary"
            size="lg"
            style={styles.continueBtn}
          />
        )}

        {/* ── Use Another Email Button ── */}
        <Button
          testID="login-another-email-btn"
          title={t('common.buttons.useAnotherEmail')}
          onPress={() => navigation.goBack()}
          size="lg"
          style={[
            styles.anotherEmailBtn,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              borderWidth: 1,
            }
          ]}
          textStyle={{ color: colors.textPrimary, fontWeight: '600' }}
        />

        {/* ── Auth Service Error ── */}
        {authError ? (
          <AppText variant="caption" color={colors.error} style={styles.authError}>
            {authError}
          </AppText>
        ) : null}
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(LoginPasswordScreen);
