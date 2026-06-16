import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius, shadows}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* ── Scroll area ── */
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
    },

    /* ── "Choose audience" label ── */
    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing[3],
    },

    /* ── Options card container ── */
    listContainer: {
      backgroundColor: 'transparent',
    },

    /* ── Individual option row ── */
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[4],
    },

    /* ── Left icon circle ── */
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
    },

    /* ── Text block ── */
    textContent: {
      flex: 1,
      marginRight: spacing[3],
    },
    optionLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      lineHeight: 20,
    },
    optionSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },

    /* ── Divider override — no vertical margin ── */
    divider: {
      marginVertical: 0,
    },

    /* ── Done button area ── */
    buttonContainer: {
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[6],
      paddingTop: spacing[3],
      backgroundColor: colors.profileBackground,
    },
  });

export default createStyles;
