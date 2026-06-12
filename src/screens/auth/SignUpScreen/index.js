/**
 * SignUpScreen — "Join the community" screen
 * Uses: BeVietnamPro fonts, react-native-vector-icons, AuthContext
 */
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../theme';
import {
  AppText,
  Button,
  InputBox,
  Divider,
  SafeContainer,
} from '../../../components/common';
import { validateSignUp } from '../../../utils/validation';
import { ROUTES } from '../../../constants';
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

const CommunityIllustration = memo(({ styles }) => (
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

const SignUpScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithFacebook, signInWithApple } = useAuth();
  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [formData, setFormData] = useState({
    email: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  const errors = useMemo(() => {
    if(!isDirty) {
      return {};
    }
    const raw = validateSignUp(formData);
    // translate keys → display strings
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, t(v)]),
    );
  }, [formData, isDirty, t]);

  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleContinue = useCallback(() => {
    setIsDirty(true);
    const validationErrors = validateSignUp(formData);

    if(Object.keys(validationErrors).length > 0) {
      return;
    }

    navigation.navigate(ROUTES.SETUP_PROFILE, { email: formData.email });
  }, [formData, navigation]);

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

  const handleLogin = useCallback(() => {
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing[4], paddingBottom: spacing[2] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: spacing[8], marginBottom: spacing[4] }}>
          <CommunityIllustration styles={styles} />
        </View>
        <AppText variant="h1" color={colors.textPrimary} style={styles.heading}>
          {t('auth.signUp.heading')}
        </AppText>

        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.signUp.subheading')}
        </AppText>
        <View style={{ marginTop: spacing[6] }}>
          <InputBox
            testID="signup-email-input"
            placeholder={t('auth.signUp.emailPlaceholder')}
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            inputStyle={styles.emailInput}
          />
        </View>
        <Button
          testID="signup-continue-btn"
          title={t('common.buttons.continue')}
          onPress={handleContinue}
          variant="primary"
          size="lg"
          style={styles.continueBtn}
        />
        <View style={styles.dividerWrapper}>
          <Divider label={t('common.orContinueWith')} thickness={2} style={styles.divider} />
        </View>
        {Platform.OS === 'ios' && (
          <SocialButton
            iconSource={require('../../../assets/images/apple.png')}
            label={t('auth.social.apple')}
            onPress={() => handleSocialLogin('apple')}
            styles={styles}
            colors={colors}
          />
        )
        }
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
            {t('auth.common.alreadyHaveAccount')}
          </AppText>
          <TouchableOpacity
            onPress={handleLogin}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <AppText variant="bodyMedium" color={colors.primary}>
              {t('common.buttons.logIn')}
            </AppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)}
          style={{ marginTop: spacing[6] }}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.privacy}>
            {t('common.privacyPolicy')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(SignUpScreen);
