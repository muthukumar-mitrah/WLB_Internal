import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  InputBox,
  Divider,
  SafeContainer,
} from '../../../components/common';
import { useAuth } from '../../../context/AuthContext';
import { validateLogin } from '../../../utils/validation';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

// ─── Social Button ────────────────────────────────────────────────────────────
const SocialButton = memo(({ iconSource, label, onPress, styles, colors }) => {
  const isApple = label.toLowerCase() === 'apple';
  const isDark = colors.textPrimary === '#FFFFFF';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.socialBtn}>
      <Image
        source={iconSource}
        style={[styles.socialIcon, isApple && isDark && { tintColor: '#FFFFFF' }]}
        resizeMode="contain"
      />
      <AppText variant="titleMedium" color={colors.textPrimary} style={styles.socialText}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
});

// ─── Logo Illustration ────────────────────────────────────────────────────────
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
const LoginScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [email, setEmail] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const error = useMemo(() => {
    if (!isDirty) {
      return '';
    }
    const validationErrors = validateLogin({ email });
    const key = validationErrors.email || '';
    return key ? t(key) : '';
  }, [email, isDirty, t]);

  const handleContinue = useCallback(() => {
    setIsDirty(true);
    const validationErrors = validateLogin({ email });
    if (Object.keys(validationErrors).length) {
      return;
    }
    // Proceed to Step 2 (Password Screen) and pass email
    navigation.navigate(ROUTES.LOGIN_PASSWORD, { email: email.trim() });
  }, [email, navigation]);

  const handleSocialLogin = useCallback(async (provider) => {
    if (provider === 'google') {
      const res = await signInWithGoogle();
      if (!res) return;
      if (res.cancelled) return;
      if (res.success !== true) return;
      if (!res.user) return;
      navigation.navigate(ROUTES.SETUP_PROFILE, {
        email: res.user.email,
        firstName: res.user.name?.split(' ')[0] || '',
        socialProvider: 'google',
        idToken: res.idToken,
        serverAuthCode: res.serverAuthCode,
      });
    }

    if (provider === 'facebook') {
      const res = await signInWithFacebook();
      if (!res) return;
      if (res.cancelled) return;
      if (res.success !== true) return;
      if (!res.user) return;

      navigation.navigate(ROUTES.SETUP_PROFILE, {
        email: res.user.email,
        firstName: res.user.name?.split(' ')[0] || '',
        socialProvider: 'facebook',
        accessToken: res.accessToken,
        facebookUserId: res.user.id,
      });
    }

    if (provider === 'apple') {
      const res = await signInWithApple();
      if (!res) return;
      if (res.cancelled) return;
      if (res.success !== true) return;
      if (!res.user) return;

      navigation.navigate(ROUTES.SETUP_PROFILE, {
        email: res.user.email,
        firstName: res.user.name?.split(' ')[0] || '',
        socialProvider: 'apple',
        identityToken: res.identityToken,
        authorizationCode: res.authorizationCode,
        appleUserId: res.user.id,
      });
    }
  }, [navigation, signInWithGoogle, signInWithFacebook, signInWithApple]);

  const handleSignUp = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate(ROUTES.SIGN_UP);
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
          {t('auth.login.heading')}
        </AppText>

        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.login.subheading')}
        </AppText>

        {/* ── Email Input ── */}
        <View style={{ marginTop: spacing[6] }}>
          <InputBox
            testID="login-email-input"
            placeholder={t('auth.login.emailPlaceholder')}
            value={email}
            onChangeText={text => setEmail(text)}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="done"
            inputStyle={styles.emailInput}
          />
        </View>

        {/* ── Continue Button ── */}
        <Button
          testID="login-continue-btn"
          title={t('common.buttons.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          style={styles.continueBtn}
        />

        {/* ── Divider ── */}
        <View style={styles.dividerWrapper}>
          <Divider label={t('common.orContinueWith')} style={styles.divider} />
        </View>

        {/* ── Social Buttons ── */}
        {Platform.OS === 'ios' && (
          <SocialButton
            iconSource={require('../../../assets/images/apple.png')}
            label={t('auth.social.apple')}
            onPress={() => handleSocialLogin('apple')}
            styles={styles}
            colors={colors}
          />
        )}
        <SocialButton
          iconSource={require('../../../assets/images/google.png')}
          label={t('auth.social.google')}
          onPress={() => handleSocialLogin('google')}
          styles={styles}
          colors={colors}
        />
        <SocialButton
          iconSource={require('../../../assets/images/facebook.png')}
          label={t('auth.social.facebook')}
          onPress={() => handleSocialLogin('facebook')}
          styles={styles}
          colors={colors}
        />

        {/* ── SignUp Redirect ── */}
        <View style={[styles.loginRow, { marginTop: spacing[6] }]}>
          <AppText variant="bodyMedium" color={colors.textPrimary}>
            {t('auth.login.dontHaveAccount')}
          </AppText>
          <TouchableOpacity
            onPress={handleSignUp}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <AppText variant="bodyMedium" color={colors.primary} style={{ fontWeight: '600' }}>
              {t('common.buttons.signUp')}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Privacy Policy ── */}
        <TouchableOpacity style={{ marginTop: spacing[6], marginBottom: spacing[4] }}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.privacy}>
            {t('common.privacyPolicy')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(LoginScreen);
