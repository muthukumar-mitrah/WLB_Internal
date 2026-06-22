import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4] || 16,
      paddingVertical: spacing[3] || 12,
      backgroundColor: colors.background,
    },
    leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rightActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    skiNewsLogo: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    kiNewsText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    filterBtn: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 20,
    },
    askAnythingText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    aiBuddyIconContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    aiBuddyIcon: {
      width: 20,
      height: 20,
    },
  });

export default createStyles;
