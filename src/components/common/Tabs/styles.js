import { StyleSheet } from 'react-native';

/**
 * CommonTabs — shared styles for the unified tab bar component.
 */
const createStyles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      width: '100%',
      paddingTop: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    // flex wrapper so the ScrollView stretches and the rightSlot stays fixed
    scrollFlex: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing[4],
      paddingBottom: 2,
      flexDirection: 'row',
    },
    rightSlot: {
      paddingRight: spacing[4],
    },
    tabBtn: {
      marginRight: spacing[5],
      paddingBottom: spacing[2],
      paddingTop: spacing[1],
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBtnActive: {},
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
    },
    activeIndicator: {
      position: 'absolute',
      bottom: -3,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: colors.primary,
      borderRadius: 1,
    },
  });

export default createStyles;
