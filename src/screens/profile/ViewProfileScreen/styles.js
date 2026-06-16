import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius, shadows}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing[10],
    },

    /* ── Buttons Row (inside ProfileInfoCard) ── */
    buttonsRow: {
      flexDirection: 'row',
      gap: spacing[3],
    },
    buttonHalf: {
      flex: 1,
    },
    viewPortraitButton: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      borderWidth: 0,
      ...shadows.sm,
    },

    /* ── Header 3-dot menu button ── */
    menuButton: {
      padding: spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* ── Action Menu Bottom Sheet items ── */
    menuItem: {
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[1],
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    menuItemDangerText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
    },

    /* ── Block Confirmation Sheet ── */
    confirmContainer: {
      alignItems: 'center',
      paddingTop: spacing[6],
      paddingBottom: spacing[3],
    },
    confirmAvatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginBottom: spacing[4],
    },
    avatarImageInternal: {
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    confirmTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing[2.5],
      textAlign: 'center',
    },
    confirmDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing[6],
      lineHeight: 20,
    },
    confirmButtonsRow: {
      flexDirection: 'row',
      width: '100%',
      gap: spacing[3],
      justifyContent: 'space-between',
    },
    confirmButton: {
      flex: 1,
    },
  });

export default createStyles;
