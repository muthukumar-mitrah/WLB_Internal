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

    /* ── Weight Progress Card ── */
    weightCard: {
      marginHorizontal: spacing[4],
      marginTop: spacing[4],
      padding: spacing[4],
      borderRadius: borderRadius['2xl'],
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.card,
    },
    weightTitle: {
      marginBottom: spacing[1],
    },
    weightSubtitle: {
      marginBottom: spacing[4],
    },
    weightRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing[4],
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },

    /* ── Header right menu button ── */
    menuButton: {
      padding: spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* ── Bottom Sheet Modals for Profile Photo ── */
    optionsContainer: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3],
    },
    iconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      lineHeight: 20,
      marginLeft: spacing[3],
    },
    modalTitle: {
      marginVertical: spacing[2],
      fontSize: 18,
      fontWeight: '600',
    },
  });

export default createStyles;
