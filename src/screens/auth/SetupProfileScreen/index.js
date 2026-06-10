import { memo, useCallback, useMemo, useState, useEffect } from 'react';
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
  SafeContainer,
  Loader,
  AppModal,
} from '../../../components/common';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../constants';
import { validateSetupProfile } from '../../../utils/validation';
import { useTranslation } from '../../../i18n/useTranslation';
import createStyles from './styles';

// ─── Illustration ─────────────────────────────────────────────────────────────
const MascotIllustration = memo(({ styles }) => (
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
const SetupProfileScreen = ({ navigation, route }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { signUpWithEmail, loading, error, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const email = route.params?.email || '';

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );

  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    password: '',
    referralCode: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const errors = useMemo(() => {
    if (!isDirty) {
      return {};
    }
    const raw = validateSetupProfile(formData);
    // translate keys → display strings
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, t(v)]),
    );
  }, [formData, isDirty, t]);

  useEffect(() => {
    if (isAuthenticated && !error) {
      setShowSuccessModal(true);
    }
  }, [isAuthenticated, error]);

  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCreateAccount = useCallback(async () => {
    setIsDirty(true);
    const validationErrors = validateSetupProfile(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // await signUpWithEmail({
    //   email: email.trim(),
    //   firstName: formData.firstName.trim(),
    //   username: formData.username.trim(),
    //   password: formData.password,
    //   ...(formData.referralCode.trim()
    //     ? { referralCode: formData.referralCode.trim() }
    //     : {}),
    // });

    setShowSuccessModal(true);
  }, [formData, email]);

  const handleLogin = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate(ROUTES.LOGIN);
    }
  }, [navigation]);

  const handleModalClose = useCallback(() => {
    setShowSuccessModal(false);
  }, [navigation]);

  const handleContinue = useCallback(() => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigation.navigate(ROUTES.BASIC_INFO);
    }, 100);
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
          { paddingHorizontal: spacing[6], paddingTop: spacing[4] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Illustration ── */}
        <MascotIllustration styles={styles} />

        {/* ── Heading ── */}
        <AppText variant="h1" color={colors.textPrimary} style={styles.heading}>
          {t('auth.setupProfile.heading')}
        </AppText>

        <AppText variant="subtitle" color={colors.textSecondary} style={styles.subheading}>
          {t('auth.setupProfile.subheading')}
        </AppText>

        {/* ── Input Fields ── */}
        <View style={styles.inputSection}>
          <View style={styles.inputWrapper}>
            <AppText variant="label" color={colors.textSecondary} style={styles.label}>
              {t('auth.setupProfile.firstNameLabel')}
            </AppText>
            <InputBox
              testID="setup-firstname"
              placeholder={t('auth.setupProfile.firstNamePlaceholder')}
              value={formData.firstName}
              onChangeText={text => handleChange('firstName', text)}
              error={errors.firstName}
              autoCapitalize="words"
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.inputWrapper}>
            <AppText variant="label" color={colors.textSecondary} style={styles.label}>
              {t('auth.setupProfile.usernameLabel')}
            </AppText>
            <InputBox
              testID="setup-username"
              placeholder={t('auth.setupProfile.usernamePlaceholder')}
              value={formData.username}
              onChangeText={text => handleChange('username', text)}
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.inputWrapper}>
            <AppText variant="label" color={colors.textSecondary} style={styles.label}>
              {t('auth.setupProfile.passwordLabel')}
            </AppText>
            <InputBox
              testID="setup-password"
              placeholder={t('auth.setupProfile.passwordPlaceholder')}
              value={formData.password}
              onChangeText={text => handleChange('password', text)}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.inputWrapper}>
            <AppText variant="label" color={colors.textSecondary} style={styles.label}>
              {t('auth.setupProfile.referralLabel')}
            </AppText>
            <InputBox
              testID="setup-referral"
              placeholder={t('auth.setupProfile.referralPlaceholder')}
              value={formData.referralCode}
              onChangeText={text => handleChange('referralCode', text)}
              autoCapitalize="characters"
              inputStyle={styles.input}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        </View>

        {/* ── Create Account Button ── */}
        {loading ? (
          <Loader visible size="large" />
        ) : (
          <Button
            testID="setup-create-btn"
            title={t('common.buttons.createAccount')}
            onPress={handleCreateAccount}
            variant="primary"
            size="lg"
            style={styles.continueBtn}
          />
        )}

        {/* ── Auth Error ── */}
        {error ? (
          <AppText variant="caption" color={colors.error} style={styles.authError}>
            {error}
          </AppText>
        ) : null}

        {/* ── Login Redirect ── */}
        <View style={styles.loginRow}>
          <AppText variant="bodyMedium" color={colors.textPrimary}>
            {t('auth.setupProfile.alreadyHaveAccount')}
          </AppText>
          <TouchableOpacity
            onPress={handleLogin}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <AppText variant="bodyMedium" color={colors.primary}>
              {t('common.buttons.logIn')}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Success Modal ── */}
      <AppModal
        visible={showSuccessModal}
        position="center"
        showCloseButton={false}
        showHandle={false}
        onClose={handleModalClose}
        overlayColor="transparent"
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Image 
            source={require('../../../assets/images/new_wlb_logo.png')} 
            style={styles.modalMascot} 
            resizeMode="contain" 
          />
          <AppText variant="h2" color={colors.textPrimary} style={styles.modalTitle}>
            {t('modals.accountCreated.title')}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.modalSubtitle}>
            {t('modals.accountCreated.subtitle')}
          </AppText>
          
          <View style={styles.modalActions}>
            <Button
              title={t('common.buttons.maybeLater')}
              onPress={handleModalClose}
              variant="ghost"
              fullWidth={false}
              style={[styles.modalBtnLater, { backgroundColor: colors.backgroundSecondary }]}
              textStyle={[styles.modalBtnLaterText, { color: colors.textPrimary }]}
            />
            <Button
              title={t('common.buttons.continue')}
              onPress={handleContinue}
              variant="primary"
              fullWidth={false}
              style={styles.modalBtnContinue}
            />
          </View>
        </View>
      </AppModal>
    </SafeContainer>
  );
};

export default memo(SetupProfileScreen);
