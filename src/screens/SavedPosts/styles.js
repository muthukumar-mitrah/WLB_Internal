import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    // ── Safe area & layout ─────────────────────────────────────────────────────
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: spacing[6],
    },

    // ── Post separator ─────────────────────────────────────────────────────────
    separator: {
      height: 8,
      backgroundColor: colors.backgroundSecondary,
    },

    // ── Empty state ────────────────────────────────────────────────────────────
    emptyState: {
      flex: 1,
      marginTop: spacing[8] * 2,
    },
  });

export default createStyles;
