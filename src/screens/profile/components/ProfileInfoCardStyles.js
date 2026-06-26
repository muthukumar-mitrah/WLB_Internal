import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius, shadows, isDark }) =>
  StyleSheet.create({
    /* ── Main Profile Card ── */
    mainCard: {
      backgroundColor: colors.background,
      marginHorizontal: spacing[4],
      marginTop: spacing[2],
      borderRadius: borderRadius['3xl'], // Very rounded
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      paddingHorizontal: spacing[3], // Reduced horizontal padding
      borderWidth: 1,
      borderColor: colors.border,
    },

    /* ── Avatar Section ── */
    avatarSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[3], // tighter spacing
    },
    avatarWrapper: {
      position: 'relative',
      marginRight: spacing[2], // minimal gap between avatar and text
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.xl, // rounded square
    },
    avatarImageInternal: {
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    cameraIconWrapper: {
      position: 'absolute',
      bottom: -6,
      right: -6,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
      ...shadows.xs,
    },
    avatarTextBlock: {
      flex: 1,
      justifyContent: 'center',
    },
    userName: {
      marginBottom: spacing[0.5],
    },
    userBio: {
      lineHeight: 18,
    },

    /* ── Stats Row ── */
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingVertical: spacing[3],
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.xl,
      marginBottom: spacing[4],
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statCount: {
      marginBottom: 2,
    },
    statDivider: {
      width: 1,
      height: 32, // taller divider
      backgroundColor: colors.border,
    },

    /* ── Info Cards Grid ── */
    infoGrid: {
      marginBottom: spacing[4],
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: spacing[2],
    },
    infoCardSingle: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primarySurface,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[3],
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.border : 'transparent',
    },
    infoCardLeft: {
      marginRight: spacing[1],
    },
    infoCardRight: {
      marginLeft: spacing[1],
    },
    infoIconWrapper: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[2.5]
    },
    infoIconImage: {
      width: 18,
      height: 18,
      tintColor: colors.primary,
    },
    infoTextBlock: {
      flex: 1,
    },
  });

export default createStyles;
