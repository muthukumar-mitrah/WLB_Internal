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
} from 'react-native';
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

// ─── Illustration ─────────────────────────────────────────────────────────────
const CommunityIllustration = memo(({ colors, styles }) => (
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
const SignUpScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [formData, setFormData] = useState({
    email: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  const errors = useMemo(() => {
    if (!isDirty) {
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
    navigation.navigate(ROUTES.WELCOME_SURVEY);
  }, [formData, navigation]);

  const handleSocialLogin = useCallback(provider => {
    // TODO: integrate actual social auth SDK
  }, []);

  const handleLogin = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate(ROUTES.LOGIN);
    }
  }, [navigation]);

  return (
    <SafeContainer avoidKeyboard edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
        translucent={false}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing[6], paddingBottom: spacing[10] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Illustration ── */}
        <View style={{ marginTop: spacing[10], marginBottom: spacing[4] }}>
          <CommunityIllustration colors={colors} styles={styles} />
        </View>

        {/* ── Heading ── */}
        <AppText variant="h1" color={colors.textPrimary} style={styles.heading}>
          {t('auth.signUp.heading')}
        </AppText>

        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.signUp.subheading')}
        </AppText>

        {/* ── Email Input ── */}
        <View style={{ marginTop: spacing[8] }}>
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

        {/* ── Continue Button ── */}
        <Button
          testID="signup-continue-btn"
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
        <SocialButton
          iconSource={require('../../../assets/images/apple.png')}
          label={t('auth.social.apple')}
          onPress={() => handleSocialLogin('apple')}
          styles={styles}
          colors={colors}
        />
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

        {/* ── Login Redirect ── */}
        <View style={[styles.loginRow, { marginTop: spacing[8] }]}>
          <AppText variant="bodyMedium" color={colors.textPrimary}>
            {t('auth.signUp.alreadyHaveAccount')}
          </AppText>
          <TouchableOpacity
            onPress={handleLogin}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <AppText variant="bodyMedium" color={colors.primary}>
              {t('common.buttons.logIn')}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Privacy Policy ── */}
        <TouchableOpacity style={{ marginTop: spacing[12] }}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.privacy}>
            {t('common.privacyPolicy')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeContainer>
  );
};

export default memo(SignUpScreen);
