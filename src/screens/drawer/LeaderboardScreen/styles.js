import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundTertiary,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    backBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[2],
    },

    // ── Filter dropdown ─────────────────────────────────────────────────
    filterContainer: {
      marginHorizontal: spacing[4],
      marginBottom: spacing[3],
      zIndex: 10,
    },
    filterPill: {
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
    filterPillActive: {
      borderColor: colors.primaryLight,
      backgroundColor: colors.primarySurface,
    },
    filterPillText: {
      flex: 1,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[2],
    },
    dropdownItemSelected: {
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.md,
      borderBottomWidth: 0,
      marginBottom: spacing[1],
    },

    // ── Leaderboard list ────────────────────────────────────────────────
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[3],
      marginBottom: spacing[2],
      backgroundColor: colors.background,
      borderRadius: 12,
    },
    rowFirst: {
      borderWidth: 1,
      borderColor: colors.accent,
    },
    rowSelected: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    rankIconContainer: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[1],
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing[3],
      backgroundColor: colors.primarySoft,
    },
    nameText: {
      flex: 1,
    },
    pointsContainer: {
      alignItems: 'flex-end',
    },
    pointText: {
      fontWeight: 'bold'
    },
    awardImage: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
    },

    // ── Your Rank card ──────────────────────────────────────────────────
    yourRankCard: {
      marginHorizontal: spacing[4],
      marginBottom: spacing[4],
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      marginTop: spacing[3]
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    yourRankLeft: {
      flex: 1,
    },
    separator: {
      height: 1,
      marginVertical: spacing[1],
    },
    yourRankLabel: {
      marginBottom: spacing[1],
    },
    yourRankValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: spacing[1],
    },
    yourRankNumber: {
      marginRight: spacing[2],
    },
    thumbnailImage: {
      width: 45,
      height: 45,
      resizeMode: 'contain',
    },
  });
