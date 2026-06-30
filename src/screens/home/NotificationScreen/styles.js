import { StyleSheet } from 'react-native';

const createStyles = ({ colors, spacing, borderRadius }) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      flexGrow: 1,
    },
    sectionHeader: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
      backgroundColor: colors.background,
    },
    sectionHeaderText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      marginTop: spacing[8] * 2,
    },
    popupMenu: {
      position: 'absolute',
      top: 60,
      right: spacing[4],
      width: 180,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md || 8,
      paddingHorizontal: 0,
      paddingBottom: 0,
      elevation: 5,
      shadowColor: colors.isDark ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      height: 48,
    },
    menuIcon: {
      marginRight: spacing[2.5],
      color: colors.textPrimary,
    },
    menuText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
  });

export default createStyles;
