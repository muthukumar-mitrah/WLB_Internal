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
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      paddingBottom: spacing[8],
    },
    // Profile Card
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[1],
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.primarySoft
    },
    cameraIcon: {
      position: 'absolute',
      bottom: -6,
      right: -6,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.xs,
    },
    profileInfo: {
      flex: 1,
      marginLeft: spacing[4],
    },
    profileName: {
      marginBottom: spacing[1]
    },
    profileEmailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileEmail: {
      marginLeft: spacing[1.5],
    },
    // Sections
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing[4],
      marginBottom: spacing[2],
    },
    sectionTitle: {
      fontWeight: '600',
    },
    sectionTitleStandalone: {
      fontWeight: '600',
      marginBottom: spacing[3],
      marginTop: spacing[4],
    },
    sectionHeaderSubtitle: {
      fontStyle: 'normal',
    },
    // Cards
    settingsCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing[1],
    },
    prefRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
    },
    prefRowCompactBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[4],
      paddingBottom: spacing[1.5],
      paddingHorizontal: spacing[4],
    },
    prefRowCompactTop: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[1.5],
      paddingBottom: spacing[4],
      paddingHorizontal: spacing[4],
    },
    prefRowCompactBoth: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[1.5],
      paddingBottom: spacing[1.5],
      paddingHorizontal: spacing[4],
    },
    prefIconContainer: {
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    preferenceIconImage: {
      width: 36,
      height: 36,
      resizeMode: 'contain',
    },
    prefTitleContainer: {
      flex: 1,
    },
    prefRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prefValueText: {
      marginRight: spacing[2],
    },
    // Segmented Controls (Unit / Online Status)
    segmentedContainer: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundTertiary,
      borderRadius: borderRadius.md,
      padding: 2,
    },
    segmentBtn: {
      paddingHorizontal: spacing[3.5],
      paddingVertical: spacing[1.5],
      borderRadius: borderRadius.sm,
      minWidth: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentBtnActive: {
      backgroundColor: colors.primary,
    },
    segmentTextActive: {
      color: colors.white,
      fontWeight: '600',
    },
    segmentTextInactive: {
      color: colors.textSecondary,
    },
    // Toggle controls
    appSettingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
    },
    appSettingRowCompactBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[4],
      paddingBottom: spacing[1.5],
      paddingHorizontal: spacing[4],
    },
    appSettingRowCompactTop: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[1.5],
      paddingBottom: spacing[4],
      paddingHorizontal: spacing[4],
    },
    appSettingRowCompactBoth: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing[1.5],
      paddingBottom: spacing[1.5],
      paddingHorizontal: spacing[4],
    },
    appSettingTextContainer: {
      flex: 1,
      marginRight: spacing[3],
    },
    appSettingTitle: {
      fontWeight: fontWeight.semiBold,
      marginBottom: 2,
    },
    appSettingDesc: {
      lineHeight: 18,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    // Account Actions
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      marginBottom: spacing[3],
    },
    logoutIconContainer: {
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    deleteCard: {
      backgroundColor: isDark ? colors.surface : colors.errorSurface,
      borderColor: colors.error,
      borderWidth: 0.5,
      borderRadius: borderRadius.lg,
      marginBottom: spacing[3]
    },
    deleteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
    },
    deleteIconContainer: {
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    actionTextContainer: {
      flex: 1,
    },
    actionTitle: {
      fontWeight: '600',
      marginBottom: 2,
    },
    actionDesc: {
      lineHeight: 18,
    },
    chevron: {
      alignSelf: 'center',
    },
    // Visibility Screens
    visibilityContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    visibilityScrollContent: {
      flexGrow: 1,
      paddingBottom: 100, // Space for sticky footer
    },
    visibilitySectionLabel: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      fontWeight: '600',
      fontSize: fontSize.md
    },
    visibilityListCard: {
      marginHorizontal: spacing[1],
    },
    visibilityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[2.5],
    },
    visibilityIconWrapper: {
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing[3],
    },
    visibilityIconImage: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    visibilityTextWrapper: {
      flex: 1,
      marginRight: spacing[3],
      paddingTop: 2,
    },
    visibilityTitle: {
      fontWeight: '600',
      marginBottom: 2,
    },
    visibilityDesc: {
      lineHeight: 18,
    },
    radioWrapper: {
      alignSelf: 'center',
    },
    visibilityButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
      paddingTop: spacing[3],
      backgroundColor: colors.background,
    },
  });

export default createStyles;
