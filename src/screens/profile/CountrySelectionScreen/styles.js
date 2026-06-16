import {StyleSheet} from 'react-native';

const createStyles = ({colors, spacing, borderRadius}) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},

    /* ── Search bar wrapper (provides margin around InputBox) ── */
    searchWrapper: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[4],
    },
    searchInputContainer: {
      marginBottom: 0,
    },

    /* ── Country list ── */
    listContent: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      paddingBottom: spacing[4],
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
