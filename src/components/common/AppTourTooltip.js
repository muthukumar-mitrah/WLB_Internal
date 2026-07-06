import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../../theme';
import { useTranslation } from '../../i18n/useTranslation';

const AppTourTooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  style,
}) => {
  const { colors, spacing, borderRadius, fonts } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(
    () =>
      createStyles({
        colors,
        spacing,
        borderRadius,
        fonts,
      }),
    [colors, spacing, borderRadius, fonts],
  );

  if (!currentStep) return null;

  // Parse JSON data for structured title & body content
  let title = '';
  let description = '';
  try {
    const parsed = JSON.parse(currentStep.text);
    title = parsed.title;
    description = parsed.body;
  } catch (e) {
    description = currentStep.text;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Title on the left, Skip Guide on the right */}
      <View style={styles.header}>
        <AppText variant="titleMedium" color={colors.textPrimary} style={styles.title}>
          {title}
        </AppText>
        <TouchableOpacity onPress={handleStop} activeOpacity={0.7} style={styles.skipBtn}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.skipText}>
            Skip Guide
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Description text */}
      <AppText variant="body" color={colors.textSecondary} style={styles.description}>
        {description}
      </AppText>

      {/* Action Buttons at the bottom center */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={isFirstStep}
          activeOpacity={0.7}
          style={[styles.navBtn, isFirstStep && { opacity: 0.5 }]}
        >
          <AppText
            variant="bodyMedium"
            color={isFirstStep ? colors.textSecondary : colors.primary}
            style={styles.navText}
          >
            {t('tour.previous')}
          </AppText>
        </TouchableOpacity>

        <View style={{ width: spacing[8] }} />

        <TouchableOpacity
          onPress={isLastStep ? handleStop : handleNext}
          activeOpacity={0.7}
          style={styles.navBtn}
        >
          <AppText variant="bodyMedium" color={colors.primary} style={styles.navText}>
            {isLastStep ? t('tour.done') : t('tour.next')}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing, borderRadius, fonts }) =>
  StyleSheet.create({
    container: {
      width: 280,
      backgroundColor: colors.isDark ? colors.backgroundSecondary : colors.cardBackground,
      borderColor: colors.isDark ? colors.borderFocused : colors.border,
      borderWidth: colors.isDark ? 1.5 : 1,
      borderRadius: borderRadius.lg,
      padding: spacing[4],
      shadowColor: colors.cardShadow || '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colors.isDark ? 0.4 : 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    title: {
      fontFamily: fonts.fontFamily.semiBold,
      fontSize: fonts.fontSize.md,
      fontWeight: fonts.fontWeight.bold,
      flex: 1,
      marginRight: spacing[2],
    },
    skipBtn: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[1.5],
    },
    skipText: {
      fontFamily: fonts.fontFamily.medium,
      fontSize: fonts.fontSize.sm,
      fontWeight: fonts.fontWeight.semiBold,
    },
    description: {
      fontFamily: fonts.fontFamily.regular,
      fontSize: fonts.fontSize.base,
      marginBottom: spacing[4],
      lineHeight: fonts.lineHeight.base,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    navBtn: {
      paddingVertical: spacing[1.5],
      paddingHorizontal: spacing[3],
    },
    navText: {
      fontFamily: fonts.fontFamily.medium,
      fontSize: fonts.fontSize.base,
      fontWeight: fonts.fontWeight.semiBold,
    },
  });

export default AppTourTooltip;
