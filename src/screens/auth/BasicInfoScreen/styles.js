import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    },
    headerBtn: {
      padding: spacing[2],
      minWidth: 40,
    },
    progressDots: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dotActive: {
      width: 24,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
      marginHorizontal: 2,
    },
    dotInactive: {
      width: 12,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginHorizontal: 2,
    },
    // Screen 1: BasicInfo Scrollable Content
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[10],
    },
    heading: {
      textAlign: 'center',
      marginVertical: spacing[4],
      fontSize: 22,
    },
    sectionLabel: {
      marginBottom: spacing[2],
      marginTop: spacing[4],
      color: colors.textSecondary,
      fontWeight: '500',
    },
    genderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    genderBtn: {
      flex: 1,
      paddingVertical: spacing[3],
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginHorizontal: spacing[1],
    },
    genderBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    genderText: {
      color: colors.textPrimary,
      fontWeight: '500',
    },
    genderTextActive: {
      color: '#FFFFFF',
    },
    pickerInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      backgroundColor: colors.surface,
    },
    pickerInputActive: {
      borderColor: colors.primaryLight,
      backgroundColor: colors.primarySurface,
    },
    pickerText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    pickerPlaceholder: {
      color: colors.textSecondary,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[2],
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    countryItemSelected: {
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.md,
      borderBottomWidth: 0,
      marginBottom: spacing[1],
    },
    // Bottom Sheet Modals (Screen 1)
    modalContainer: {
      paddingHorizontal: 0,
      paddingBottom: spacing[8],
      paddingTop: spacing[4],
      backgroundColor: colors.backgroundSecondary,
    },
    modalContent: {
      alignItems: 'center',
      width: '100%',
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: 2,
      marginBottom: spacing[6],
    },
    toggleBtn: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      borderRadius: borderRadius.md,
    },
    toggleBtnActive: {
      backgroundColor: colors.surface,
      borderColor: colors.primaryLight,
      borderWidth: 1,
    },
    toggleText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    toggleTextActive: {
      color: colors.primary,
    },
    valueTextContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: spacing[2],
    },
    valueText: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    unitText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginLeft: 4,
    },

    // Screen 2: Upload Image Scrollable Content
    uploadScrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      alignItems: 'center',
    },
    uploadHeading: {
      textAlign: 'center',
      marginTop: spacing[4],
      marginBottom: spacing[2],
      fontSize: 22,
    },
    subtitle: {
      textAlign: 'center',
      paddingHorizontal: spacing[6],
      lineHeight: 22,
      marginBottom: spacing[8],
    },
    // Avatar circle
    avatarWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[2],
    },
    avatarCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.backgroundTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 2,
      right: -4,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    hint: {
      textAlign: 'center',
      marginBottom: spacing[6],
      fontSize: 12,
    },
    // Upload zone (dashed border)
    uploadZone: {
      width: '100%',
      minHeight: 160,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primaryLight,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primarySurface,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing[6],
      paddingHorizontal: spacing[4],
    },
    uploadIconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[3],
    },
    uploadLabel: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 15,
      marginBottom: spacing[1],
    },
    uploadHint: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    // Progress state inside upload zone
    progressContainer: {
      width: '100%',
      paddingHorizontal: spacing[2],
    },
    progressFileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[3],
    },
    progressFileIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[3],
      alignSelf: 'center',
    },
    progressBarBg: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      width: '100%',
      marginBottom: spacing[2],
    },
    progressBarFill: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: spacing[1],
    },
    progressLabel: {
      fontSize: 13,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    progressPercent: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    fileName: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    // Fixed Bottom Button (Shared)
    bottomBtnContainer: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      paddingTop: spacing[3],
      backgroundColor: colors.background,
    },
    nextBtn: {
      paddingVertical: 14,
      borderRadius: borderRadius.md,
    },
    // Camera/Gallery Bottom Sheet Modal Options
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: spacing[2],
      marginBottom: spacing[1],
    },
    modalSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing[6],
    },
    photoOptionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: spacing[1],
    },
    photoOptionCard: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing[5],
      paddingHorizontal: spacing[3],
      alignItems: 'center',
      marginHorizontal: spacing[2],
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    photoOptionIconBg: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[3],
    },
    photoOptionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing[1],
      textAlign: 'center',
    },
    photoOptionDesc: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 14,
    },
  });

export default createStyles;
