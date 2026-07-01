import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius, shadows, isDark}) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},

    content: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
    },

    /* ── Privacy Row ── */
    privacyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    privacyTextContainer: {
      flex: 1,
    },
    privacyLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    privacyValue: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    pickerWrapper: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[2],
      overflow: 'hidden',
      zIndex: 2,
      ...(isDark ? shadows.md : shadows.xs),
    },

    modalContent: {
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
    },
    spacer: {
      flex: 1,
    },

    /**
     * Full-screen transparent overlay rendered behind the picker wrapper.
     * Tapping this area fires handleClosePicker without affecting the picker itself.
     */
    pickerBackdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
    },

    buttonContainer: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      backgroundColor: colors.profileBackground,
    },

    calendarIcon: {
      width: 20,
      height: 20,
      tintColor: colors.textSecondary,
    },
  });

export default createStyles;
