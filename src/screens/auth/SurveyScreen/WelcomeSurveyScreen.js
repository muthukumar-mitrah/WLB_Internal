/**
 * WelcomeSurveyScreen
 * Entry point of the survey flow — shown after BasicInfo / UploadImage.
 * Design: white background, hero illustration, two CTAs.
 */
import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../theme';
import { AppText, Button, SafeContainer } from '../../../components/common';
import { ROUTES } from '../../../constants';
import { useTranslation } from '../../../i18n/useTranslation';
import { fontFamily } from '../../../theme/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Screen ───────────────────────────────────────────────────────────────────
const WelcomeSurveyScreen = ({ navigation }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius }),
    [colors, spacing, borderRadius],
  );
  const isDark = useTheme().isDark;
  const welcomeSurveyImage = isDark
    ? require('../../../assets/images/welcome_survey_dark.png')
    : require('../../../assets/images/welcome_survey.png');

  const handleGetStarted = useCallback(() => {
    navigation.navigate(ROUTES.SURVEY_Q1);
  }, [navigation]);

  const handleSkip = useCallback(() => {
    // Naviage to further flow (e.g. home screen) without completing survey
  }, [navigation]);

  return (
    <SafeContainer edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppText variant="bodyMedium" color={colors.primary}>
            {t('survey.welcome.skip')}
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.illustrationWrapper}>
        <Image
          source={welcomeSurveyImage}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textSection}>
        <AppText variant="h2" color={colors.textPrimary} style={styles.title}>
          {t('survey.welcome.title')}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {t('survey.welcome.subtitle')}
        </AppText>
      </View>
      <View style={styles.ctaSection}>
        <Button
          title={t('common.buttons.getStarted')}
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
          style={styles.primaryBtn}
        />
        <View style={styles.dividerRow}>
          <AppText variant="caption" color={colors.textTertiary} style={styles.dividerText}>
            {t('common.or')}
          </AppText>
        </View>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <AppText variant="bodyMedium" color={colors.textSecondary} style={{ fontFamily: fontFamily.semiBold }}>
            {t('common.buttons.doThisLater')}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeContainer>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
    },
    skipBtn: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2],
    },

    // Illustration
    illustrationWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[6],
    },
    illustration: {
      width: SCREEN_WIDTH * 0.82,
      height: SCREEN_HEIGHT * 0.38,
    },

    // Text
    textSection: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[6],
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing[3],
      fontFamily: fontFamily.headingBold,
      fontSize: 32,
      lineHeight: 40
    },
    subtitle: {
      textAlign: 'center',
      lineHeight: 22,
      fontFamily: fontFamily.regular,
      fontSize: 15,
    },

    // CTAs
    ctaSection: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      gap: spacing[3],
    },
    primaryBtn: {
      borderRadius: borderRadius.xl,
    },

    // Divider
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing[1],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },
    dividerText: {
      marginHorizontal: spacing[3],
      color: colors.textTertiary,
      textAlign: 'center',
      flex: 1,
      justifyContent: 'center'
    },

    // Secondary button — light gray pill
    secondaryBtn: {
      height: 52,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.backgroundTertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default memo(WelcomeSurveyScreen);
