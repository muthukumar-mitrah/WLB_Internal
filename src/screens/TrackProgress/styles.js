import { StyleSheet } from 'react-native';
import { fontSize, fontWeight } from '../../theme/fonts';

const createStyles = ({ colors, spacing, borderRadius, shadows, isDark }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
    },

    // Top Banner Card
    bannerCard: {
      backgroundColor: colors.primaryNav,
      borderRadius: borderRadius.lg,
      padding: spacing[2],
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    bannerIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    bannerIcon: {
      width: 22,
      height: 22,
      resizeMode: 'contain',
    },
    bannerTextContainer: {
      flex: 1,
    },
    bannerTitle: {
      color: colors.white,
      fontWeight: fontWeight.semiBold,
      marginBottom: 2,
      fontSize:fontSize.base
    },
    bannerSubtitle: {
      color: colors.gray200,
    },
    bannerButton: {
      backgroundColor: colors.gray100,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerButtonText: {
      color: colors.gray900,
      fontWeight: fontWeight.semiBold,
      fontSize: fontSize.base,
    },

    // Tracker Card Base
    trackerCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing[2],
      marginBottom: spacing[4],
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    cardHeaderIconWrapper: {
      borderRadius: borderRadius.xl,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    cardHeaderIcon: {
      width: 36,
      height: 36,
      resizeMode: 'contain',
    },
    cardHeaderTextContainer: {
      flex: 1,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardTitle: {
      fontWeight: fontWeight.semiBold,
      marginRight: 4,
    },
    badge: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2.5],
      borderRadius: borderRadius.md,
    },
    badgeText: {
      fontWeight: fontWeight.bold,
    },

    // Segmented Control Tabs
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: isDark ? colors.backgroundTertiary : colors.backgroundSecondary,
      borderRadius: borderRadius.md,
      padding: 2,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: spacing[2] - 1.5,
      paddingHorizontal: spacing[1],
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    tabBtnActive: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
      ...shadows.xs,
    },
    tabTextActive: {
      fontWeight: fontWeight.semiBold,
      color: colors.textPrimary,
    },
    tabTextInactive: {
      color: colors.textSecondary,
    },

    // BMI Range Indicator styles
    bmiRangeContainer: {
      marginTop: spacing[3],
      marginBottom: spacing[2],
    },
    bmiRangesBar: {
      flexDirection: 'row',
      height: 6,
      borderRadius: borderRadius.sm,
      overflow: 'visible',
      position: 'relative',
      marginBottom: spacing[2],
    },
    bmiSegment: {
      flex: 1,
      height: '100%',
      borderRadius: borderRadius.sm,
      marginHorizontal: spacing[0.5],
    },
    bmiSegmentUnderweight: {
      backgroundColor: colors.info,
    },
    bmiSegmentNormal: {
      backgroundColor: colors.success,
    },
    bmiSegmentOverweight: {
      backgroundColor: colors.warning,
    },
    bmiSegmentObese: {
      backgroundColor: colors.error,
    },
    bmiIndicatorDot: {
      position: 'absolute',
      top: -4,
      width: 14,
      height: 14,
      borderRadius: borderRadius.full,
      borderWidth: 2,
      borderColor: colors.surface,
      transform: [{ translateX: -7 }],
      ...shadows.xs,
    },
    bmiRangeLabelsRow: {
      flexDirection: 'row',
      marginBottom: spacing[1],
    },
    bmiRangeLabelContainer: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: spacing[0.5],
    },
    bmiRangeLabelText: {
      fontSize: 9,
      fontWeight: fontWeight.medium,
      textAlign: 'center',
    },
    bmiStatusText: {
      fontWeight: fontWeight.medium,
      marginTop: spacing[0.5],
      fontSize: fontSize.sm,
    },
    bmiStatusHighlightText: {
      fontWeight: fontWeight.bold,
    },

    // Update Weight Bottom Sheet Styles

    headerRightButton: {
      padding: spacing[1],
    },
    bodyWeightBadgeUnit: {
      fontSize: 10,
    },
    bmiIconContainer: {
      borderRadius: borderRadius.xl,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    bmiBadge: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2.5],
      borderRadius: borderRadius.md,
      backgroundColor: colors.warmSurface,
    },
    bmiBadgeText: {
      fontWeight: fontWeight.bold,
      color: colors.warning,
    },
    bmiBadgeUnitText: {
      fontSize: 10,
      color: colors.warning,
    },
    chartContainer: {
      alignItems: 'center',
      marginVertical: spacing[2],
      marginHorizontal: -spacing[4]

    },
    monthlyChart: {
      paddingBottom: spacing[0.5]
    },
  });

export default createStyles;
