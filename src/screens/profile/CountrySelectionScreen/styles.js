import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius}) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},

    /* ── Content ── */
    content: {
      flex: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[4],
    },

    /* ── Privacy Row ── */
    privacyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing[3],
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

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[4],
    },

    optionLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      marginRight: spacing[3],
    },

    divider: {marginVertical: 0},

    emptyText: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: spacing[8],
    },

    /* ── Done button ── */
    buttonContainer: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      paddingTop: spacing[3],
      backgroundColor: colors.profileBackground,
    },
  });

export default createStyles;
