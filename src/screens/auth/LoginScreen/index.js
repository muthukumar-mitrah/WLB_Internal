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
  ToastService,
} from '../../../components/common';
import { useAuth } from '../../../context/AuthContext';
import { validateUsernameOrEmail } from '../../../utils/validation';
import { ROUTES, MOCK_AUTH } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

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
    if(!isDirty) {
      return '';
    }
    const result = validateUsernameOrEmail(email);
    return result.valid ? '' : t(result.message);
  }, [email, isDirty, t]);

  const handleContinue = useCallback(() => {
    setIsDirty(true);
    const result = validateUsernameOrEmail(email);
    if(!result.valid) {
      return;
    }
    // Temporary static user lookup — replaced by API once available.
    if(email.trim().toLowerCase() !== MOCK_AUTH.IDENTIFIER) {
      ToastService.show({
        type: 'error',
        message: t('auth.errors.userNotFound'),
      });
      return;
    }
    navigation.navigate(ROUTES.LOGIN_PASSWORD, { email: email.trim() });
  }, [email, navigation, t]);

  const handleSocialLogin = useCallback(async (provider) => {
    if(provider === 'google') {
      const res = await signInWithGoogle();
      if(!res) return;
      if(res.cancelled) return;
      if(res.success !== true) return;
      if(!res.user) return;
      navigation.navigate(ROUTES.SETUP_PROFILE, {
        email: res.user.email,
        firstName: res.user.name?.split(' ')[0] || '',
        socialProvider: 'google',
        idToken: res.idToken,
        serverAuthCode: res.serverAuthCode,
      });
    }

    if(provider === 'facebook') {
      const res = await signInWithFacebook();
      if(!res) return;
      if(res.cancelled) return;
      if(res.success !== true) return;
      if(!res.user) return;

      navigation.navigate(ROUTES.SETUP_PROFILE, {
        email: res.user.email,
        firstName: res.user.name?.split(' ')[0] || '',
        socialProvider: 'facebook',
        accessToken: res.accessToken,
        facebookUserId: res.user.id,
      });
    }

    if(provider === 'apple') {
      const res = await signInWithApple();
      if(!res) return;
      if(res.cancelled) return;
      if(res.success !== true) return;
      if(!res.user) return;

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
    if(navigation?.navigate) {
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
        <View style={{ marginTop: spacing[10], marginBottom: spacing[4] }}>
          <LogoHeader styles={styles} />
        </View>
        <AppText variant="h1" color={colors.textPrimary} style={styles.heading}>
          {t('auth.login.heading')}
        </AppText>
        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.login.subheading')}
        </AppText>
        <View style={{ marginTop: spacing[6] }}>
          <InputBox
            testID="login-email-input"
            placeholder={t('auth.login.usernameOrEmailPlaceholder')}
            value={email}
            onChangeText={text => setEmail(text)}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            returnKeyType="done"
            inputStyle={styles.emailInput}
          />
        </View>
        <Button
          testID="login-continue-btn"
          title={t('common.buttons.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          style={styles.continueBtn}
        />
        <View style={styles.dividerWrapper}>
          <Divider label={t('common.orContinueWith')} style={styles.divider} />
        </View>
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
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
          style={{ marginTop: spacing[6], marginBottom: spacing[4] }}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.privacy}>
            {t('common.privacyPolicy')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(LoginScreen);
