import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius, isDark }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      borderBottomWidth: isDark ? 0 : 1,
      borderBottomColor: colors.divider,
    },
    unreadBackground: {
      backgroundColor: isDark ? colors.surfaceElevated : colors.primarySurface,
      borderColor: colors.cardBorder,
    },
    readBackground: {
      backgroundColor: colors.cardBackground,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.cardBorder : 'transparent',
      borderRadius: isDark ? 8 : 0,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    avatarContainer: {
      position: 'relative',
      width: 48,
      height: 48,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    badge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.cardBackground,
    },
    contentContainer: {
      flex: 1,
      marginLeft: spacing[3],
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    message: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: spacing[1],
      lineHeight: 18,
    },
    time: {
      fontSize: 11,
      color: colors.textTertiary,
      marginTop: spacing[1],
    },
    buttonsContainer: {
      flexDirection: 'row',
      marginTop: spacing[3],
      marginLeft: 60, // align with text, leaving avatar space
    },
    button: {
      flex: 1,
      height: 38,
      borderRadius: borderRadius.md || 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      marginRight: spacing[3],
    },
    secondaryButton: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '600',
    },
    secondaryButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
  });

export default createStyles;
