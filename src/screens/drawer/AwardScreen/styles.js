import { StyleSheet } from 'react-native';

export const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      paddingBottom: spacing[8],
    },

    // ── Points card ─────────────────────────────────────────────────────
    pointsCard: {
      marginHorizontal: spacing[4],
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    pointsCardGradient: {
      padding: spacing[3],
      borderRadius: borderRadius.xl,
      backgroundColor: colors.primaryDark,
    },
    pointsCardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    pointsCardLeft: {
      flex: 1,
    },
    rewardIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    levelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[3],
    },
    progressBarTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
      marginBottom: spacing[3],
    },
    progressBarFill: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.white,
    },
    currentLevelText: {
      marginBottom: spacing[4],
      paddingBottom: spacing[4],
      borderBottomColor: colors.blue400,
      borderBottomWidth: 1,
    },

    // ── Award Levels ────────────────────────────────────────────────────
    sectionTitle: {
      marginHorizontal: spacing[4],
      marginTop: spacing[4],
      marginBottom: spacing[2],
    },
    awardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing[4],
      justifyContent: 'space-between',
    },
    awardCard: {
      width: '48%',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[2],
      marginBottom: spacing[3]
    },
    awardCardSelected: {
      borderColor: colors.primary,
      borderWidth: 1,
    },
    awardIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[1.5],
    },
    awardCardTitle: {
      marginBottom: spacing[0.5],
    },
    awardImage: {
      width: 45,
      height: 45,
      resizeMode: 'contain',
    },

    // ── How to Earn Points ──────────────────────────────────────────────

    pointsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pointText: {
      marginLeft: spacing[1], // adjust spacing if needed
    },
    earnSectionTitle: {
      marginHorizontal: spacing[4],
      marginTop: spacing[4],
      marginBottom: spacing[2],
    },
    earnCard: {
      borderWidth: 0.5,
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
      marginHorizontal: spacing[4],
      marginBottom: spacing[3],
      overflow: 'hidden',
    },
    earnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
    },
    earnIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[2],
    },
    earnImage: {
      width: 35,
      height: 35,
      resizeMode: 'contain',
    },
    earnLabel: {
      flex: 1,
    },
    earnDivider: {
      marginHorizontal: 0,
      marginVertical: 0,
    },
  });
